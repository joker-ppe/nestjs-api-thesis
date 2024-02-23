import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';
import rabbitMQService from '../rabbitmq/rabbitMQService'; // Adjust the path according to your project structure
import { AuthService } from 'src/auth/auth.service';

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

  async updateDevice(
    userId: number,
    deviceId: number,
    topic: string,
    accessToken: string,
  ) {
    // check device first
    const device = await this.prismaService.device.findFirst({
      where: {
        id: deviceId,
      },
    });
    if (!device) {
      throw new NotFoundException('Device not found');
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

    await this.prismaService.device.update({
      where: {
        id: deviceId,
      },
      data: {
        userId: userId,
      },
    });

    const user = {
      userId: userId,
      deviceId: deviceId,
      accessToken: accessToken,
    };

    const data = this.encrypt(JSON.stringify(user));

    await rabbitMQService.sendToQueue(topic, data.encryptedData);

    return JSON.parse(data.encryptedData);
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

    return { deviceId: deviceId, userId: user.id };
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
