import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private prismaService: PrismaService) {}

  private publicKey: string;
  private privateKey: string;

  async onModuleInit() {
    this.publicKey = await this.getPublicKeyFromDatabase();
    this.privateKey = await this.getPrivateKeyFromDatabase();
  }

  async encryptData(data: string): Promise<{ encryptedData: string }> {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(this.publicKey, buffer);
    return { encryptedData: encrypted.toString('base64') };
  }

  async decryptData(data: string): Promise<{ decryptedData: string }> {
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
