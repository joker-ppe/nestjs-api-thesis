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
    @Query('api_key') apiKey: string,
    @Param('id', ParseIntPipe) deviceId: number,
  ) {
    return this.deviceService.getDeviceById(apiKey, deviceId);
  }

  @Post()
  insertDevice(@Query('api_key') apiKey: string, @Body() deviceDTO: DeviceDTO) {
    return this.deviceService.insertDevice(apiKey, deviceDTO);
  }

  @Patch('id/:id')
  updateDeviceInfo(
    @Query('api_key') apiKey: string,
    @Param('id', ParseIntPipe) deviceId: number,
    @Body() deviceDTO: DeviceDTO,
  ) {
    return this.deviceService.updateDevice(apiKey, deviceId, deviceDTO);
  }
}
