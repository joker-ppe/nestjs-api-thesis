import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum SlotStatus {
  NOT_YET = 'NOT_YET',
  DONE = 'DONE',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCEL = 'CANCEL',
  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN',
  // Add more status codes as needed
}

export const isSlotStatus = (status: any): status is SlotStatus => {
  return status in SlotStatus;
};

export const parseDateToString = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const parseDate = (dateString: string): Date => {
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    return null;
  }
  const date = new Date(
    Number(parts[2]),
    Number(parts[1]) - 1,
    Number(parts[0]),
  );
  if (isNaN(date.getTime())) {
    // The string is not a valid date
    return null;
  } else {
    return date;
  }
};

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

  scheduleId: number;
}

export class SlotStatusDTO {
  id: number;

  slotId: number;

  @IsEnum(SlotStatus)
  @ApiProperty()
  status: string;
}

export class DateInScheduleInUseDTO {
  index: number;
  date: string;

  slots: SlotInScheduleInUseDTO[];
}

export class SlotInScheduleInUseDTO {
  index: number;
  status: string = SlotStatus.NOT_YET;
  note: string;
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
  numberOfDates: number = 0;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  longitude: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  latitude: number;

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

  @ApiProperty({ type: [SlotDTO] })
  @ValidateNested()
  slots: SlotDTO[];
}
