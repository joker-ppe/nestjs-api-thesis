import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(authDTO: AuthDTO) {
    //generate password to hashedPassword
    const hashedPassword = await argon.hash(authDTO.password);
    //insert dat to database
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          hashedPassword: hashedPassword,
          firstName: '',
          lastName: '',
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return await this.signJwtToken(user.id, user.email);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('User with this email already exists');
      }
    }
  }
  async login(authDTO: AuthDTO) {
    // find user with input email

    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: authDTO.email,
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

      return await this.signJwtToken(user.id, user.email);
    } catch (error) {
      throw new ForbiddenException(error.code);
    }
  }

  async signJwtToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
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
