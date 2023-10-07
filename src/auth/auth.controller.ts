import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDTO } from './dto/register.user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  // auth service
  constructor(private authService: AuthService) {}

  @Post('register') // register new user
  // register(@Req() request: Request) {
  register(@Body() registerUserDTO: RegisterUserDTO) {
    // body'type must be a "Data Transfer object" - DTO
    // console.log(authDTO);

    return this.authService.register(registerUserDTO);
  }

  @Post('login') // login new user
  login(@Body() authDTO: AuthDTO) {
    return this.authService.login(authDTO);
  }
}
