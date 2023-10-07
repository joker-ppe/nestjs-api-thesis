import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDTO } from './dto/register.user.dto';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerUserDTO: RegisterUserDTO) {
    //generate password to hashedPassword
    const hashedPassword = await argon.hash(registerUserDTO.password);
    //insert dat to database
    try {
      const user = await this.prismaService.user.create({
        data: {
          userName: registerUserDTO.userName,
          hashedPassword: hashedPassword,
          firstName: registerUserDTO.firstName,
          middleName: registerUserDTO.middleName,
          lastName: registerUserDTO.lastName,
          email: registerUserDTO.email,
          longitude: registerUserDTO.longitude,
          latitude: registerUserDTO.latitude,
          address: registerUserDTO.address,
          city: registerUserDTO.city,
          country: registerUserDTO.country,
        },
        select: {
          id: true,
          userName: true,
          createdAt: true,
        },
      });
      // return await this.signJwtToken(user.id, user.userName);
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('User name already exists');
      }
      throw new ForbiddenException(error.message);
    }
  }
  async login(authDTO: AuthDTO) {
    // find user with input email

    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          userName: authDTO.userName,
        },
      });

      if (!user) {
        throw new ForbiddenException('User not found');
      }

      const passwordMatched = await argon.verify(
        user.hashedPassword,
        authDTO.password,
      );

      if (!passwordMatched) {
        throw new ForbiddenException('Incorrect password');
      }

      delete user.hashedPassword; //remove a field in the object
      //it doesn't affect to the database

      return await this.signJwtToken(user.id, user.userName);
    } catch (error) {
      throw new ForbiddenException(error.code);
    }
  }

  async signJwtToken(
    userId: number,
    userName: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      userName,
    };
    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: 24 * 3600, // 24 hours
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      accessToken: jwtString,
    };
  }
}
