import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DeviceDTO {
  id: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  name: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  macAddress: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  serialNumber: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  systemInfo: string;
}

export class SlotDTO {
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  endTime: string;
}

export class DayDTO {
  id: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  title: string;

  @ApiProperty({ type: [SlotDTO] })
  @ValidateNested()
  slots: SlotDTO[];
}

export class ScheduleDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isPublic: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  plantName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  imageData: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  moistureThreshold: number = -1;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  temperatureThreshold: number = -1;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  ecThreshold: number = -1;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  pHThreshold: number = -1;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  nThreshold: number = -1;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  pThreshold: number = -1;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  kThreshold: number = -1;

  // @IsNumber()
  // @IsNotEmpty()
  // @ApiProperty()
  // userId: number;

  // @IsNotEmpty()
  // @IsNumber()
  // @ApiProperty()
  userId: number;

  @ApiProperty({ type: [DayDTO] })
  @ValidateNested()
  days: DayDTO[];
}

enum SlotStatus {
  NotYet = 1,
  Done = 2,
  Cancel = 3,
  // Add more status codes as needed
}

export { SlotStatus };
