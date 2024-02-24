import { DeviceService } from './device.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceDTO } from 'src/schedule/dto';

@Controller('devices')
@ApiTags('Device')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Get('id/:id')
  getDeviceById(
    @Query('apiKey') apiKey: string,
    @Param('id', ParseIntPipe) deviceId: number,
  ) {
    return this.deviceService.getDeviceById(apiKey, deviceId);
  }

  @Get()
  getDeviceByMacAddressAndSerialNumber(
    @Query('apiKey') apiKey: string,
    @Query('macAddress') macAddress: string,
    @Query('serialNumber') serialNumber: string,
  ) {
    return this.deviceService.getDeviceByMacAddressAndSerialNumber(
      apiKey,
      macAddress,
      serialNumber,
    );
  }

  @Post()
  insertDevice(@Query('apiKey') apiKey: string, @Body() deviceDTO: DeviceDTO) {
    return this.deviceService.insertDevice(apiKey, deviceDTO);
  }

  @Patch('id/:id')
  updateDeviceInfo(
    @Query('apiKey') apiKey: string,
    @Param('id', ParseIntPipe) deviceId: number,
    @Body() deviceDTO: DeviceDTO,
  ) {
    return this.deviceService.updateDevice(apiKey, deviceId, deviceDTO);
  }
}
