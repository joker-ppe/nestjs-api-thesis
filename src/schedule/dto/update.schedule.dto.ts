import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateScheduleDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
