import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InsertScheduleDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
