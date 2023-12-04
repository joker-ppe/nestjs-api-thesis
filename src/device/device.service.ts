import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeviceDTO } from 'src/schedule/dto';

@Injectable()
export class DeviceService {
  constructor(private prismaService: PrismaService) {}

  async getDeviceById(apiKey: string, deviceId: number) {
    const apiKeyOnSystem = await this.prismaService.key.findFirst({
      where: {
        name: 'api_key_device',
      },
    });

    if (apiKey === apiKeyOnSystem.key) {
      const device = await this.prismaService.device.findUnique({
        where: {
          id: deviceId,
        },
      });

      if (!device) {
        throw new NotFoundException('Device is not exist.');
      }

      return device;
    } else {
      throw new ForbiddenException('Wrong API key.');
    }
  }

  async getDeviceByMacAddressAndSerialNumber(
    apiKey: string,
    macAddress: string,
    serialNumber: string,
  ) {
    const apiKeyOnSystem = await this.prismaService.key.findFirst({
      where: {
        name: 'api_key_device',
      },
    });

    if (apiKey === apiKeyOnSystem.key) {
      const device = await this.prismaService.device.findFirst({
        where: {
          macAddress: macAddress,
          serialNumber: serialNumber,
        },
      });

      if (!device) {
        throw new NotFoundException('Device is not exist.');
      }

      return device;
    } else {
      throw new ForbiddenException('Wrong API key.');
    }
  }

  async insertDevice(apiKey: string, deviceDTO: DeviceDTO) {
    const apiKeyOnSystem = await this.prismaService.key.findFirst({
      where: {
        name: 'api_key_device',
      },
    });

    if (apiKey === apiKeyOnSystem.key) {
      const device = await this.prismaService.device.create({
        data: {
          name: deviceDTO.name,
          description: deviceDTO.description,
          macAddress: deviceDTO.macAddress,
          serialNumber: deviceDTO.serialNumber,
          systemInfo: deviceDTO.systemInfo,
        },
      });

      return device;
    } else {
      throw new ForbiddenException('Wrong API key.');
    }
  }

  async updateDevice(apiKey: string, deviceId: number, deviceDTO: DeviceDTO) {
    const apiKeyOnSystem = await this.prismaService.key.findFirst({
      where: {
        name: 'api_key_device',
      },
    });

    if (apiKey === apiKeyOnSystem.key) {
      const device = await this.prismaService.device.findUnique({
        where: {
          id: deviceId,
        },
      });

      if (!device) {
        throw new NotFoundException('Device is not exist.');
      }

      return await this.prismaService.device.update({
        where: {
          id: deviceId,
        },
        data: {
          name: deviceDTO.name,
          description: deviceDTO.description,
          systemInfo: deviceDTO.systemInfo,
        },
      });
    } else {
      throw new ForbiddenException('Wrong API key.');
    }
  }
}
