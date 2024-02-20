import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  middleName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  address: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  city: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  country: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  photoUrl: string;
}
