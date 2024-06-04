import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';
import rabbitMQService from '../rabbitmq/rabbitMQService'; // Adjust the path according to your project structure
import { AuthService } from 'src/auth/auth.service';
import { ProfileDTO } from '../auth/dto/register.user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  private publicKey: string;
  private privateKey: string;

  async onModuleInit() {
    this.publicKey = await this.getPublicKeyFromDatabase();
    this.privateKey = await this.getPrivateKeyFromDatabase();
  }

  async updateProfile(userId: number, data: ProfileDTO) {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        photoUrl: data.photoUrl,
      },
      select: {
        firstName: true,
        lastName: true,
        photoUrl: true,
      },
    });
  }

  async renewAccessToken(
    apiKey: string,
    userId: number,
    cabinetId: number,
    oldAccessToken: string,
  ) {
    const apiKeyOnSystem = await this.prismaService.key.findFirst({
      where: {
        name: 'api_key_device',
      },
    });

    if (apiKey !== apiKeyOnSystem.key) {
      throw new NotFoundException('Wrong API key');
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
        deviceId: cabinetId,
        deviceAccessToken: oldAccessToken,
      },
    });

    if (!user) {
      throw new NotFoundException('Wrong user or device');
    }

    const accessToken = await this.authService.signJwtToken(
      user.id,
      user.userName,
    );

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        deviceAccessToken: accessToken,
      },
    });

    return { accessToken: accessToken };
  }

  async updateDevice(userId: number, deviceId: number, accessToken: string) {
    // check device first
    const device = await this.prismaService.device.findUnique({
      where: {
        id: deviceId,
      },
    });
    if (!device) {
      throw new NotFoundException('Device not found');
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user.scheduleIdInUse || user.scheduleInUseData) {
      throw new NotFoundException('User still has schedule in use');
    }

    if (device.userId) {
      if (device.userId === userId) {
        return JSON.stringify(device);
      } else {
        throw new NotFoundException('Device already assigned to another user');
      }
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        deviceId: deviceId,
        deviceAccessToken: accessToken,
      },
    });

    const cabinet = await this.prismaService.device.update({
      where: {
        id: deviceId,
      },
      data: {
        userId: userId,
      },
    });

    const userData = {
      userId: userId,
      deviceId: deviceId,
      accessToken: accessToken,
    };

    const data = this.encrypt(JSON.stringify(userData));

    console.log(data);

    await rabbitMQService.sendToExchange(
      `cabinet.${deviceId}.login`,
      data.encryptedData,
    );

    return JSON.stringify(cabinet);
  }

  async removeDevice(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const deviceId = user.deviceId;

    if (!deviceId) {
      throw new NotFoundException('Device not found');
    }

    if (user.scheduleIdInUse || user.scheduleInUseData) {
      throw new NotFoundException('User still has schedule in use');
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        deviceId: null,
        deviceAccessToken: null,
      },
    });

    await this.prismaService.device.update({
      where: {
        id: deviceId,
      },
      data: {
        userId: null,
      },
    });

    const data = {
      userId: user.id,
    };

    await rabbitMQService.sendToExchange(
      `cabinet.${deviceId}.logout`,
      JSON.stringify(data),
    );

    return user;
  }

  async encryptData(
    apiKey: string,
    data: string,
  ): Promise<{ encryptedData: string }> {
    const apiKeyOnSystem = await this.prismaService.key.findFirst({
      where: {
        name: 'api_key_device',
      },
    });

    if (apiKey !== apiKeyOnSystem.key) {
      throw new NotFoundException('Wrong API key');
    }

    return this.encrypt(data);
  }

  private encrypt(data: string): { encryptedData: string } {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(this.publicKey, buffer);
    return { encryptedData: encrypted.toString('base64') };
  }

  async decryptData(
    apiKey: string,
    data: string,
  ): Promise<{ decryptedData: string }> {
    const apiKeyOnSystem = await this.prismaService.key.findFirst({
      where: {
        name: 'api_key_device',
      },
    });

    if (apiKey !== apiKeyOnSystem.key) {
      throw new NotFoundException('Wrong API key');
    }

    return this.decryptDataWithPrivateKey(data);
  }

  private decryptDataWithPrivateKey(data: string): { decryptedData: string } {
    try {
      const buffer = Buffer.from(data, 'base64');
      const decrypted = crypto.privateDecrypt(this.privateKey, buffer);
      return { decryptedData: decrypted.toString('utf8') };
    } catch (error) {
      throw new NotFoundException('Invalid encryptedData');
    }
  }

  async sendDataToRabbitMQ(exchange: string, message: string) {
    await rabbitMQService.sendToExchange(exchange, message);

    return { message: 'Sent' };
  }

  private async getPublicKeyFromDatabase() {
    const config = await this.prismaService.key.findFirst({
      where: { name: 'PUBLIC_KEY' },
    });
    return config.key;
  }

  private async getPrivateKeyFromDatabase() {
    const config = await this.prismaService.key.findFirst({
      where: { name: 'PRIVATE_KEY' },
    });
    return config.key;
  }
}
