import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

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

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

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
