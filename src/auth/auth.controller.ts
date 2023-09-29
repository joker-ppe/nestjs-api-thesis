import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  // auth service
  constructor(private authService: AuthService) {}

  @Post('register') // register new user
  // register(@Req() request: Request) {
  register(@Body() authDTO: AuthDTO) {
    // body'type must be a "Data Transfer object" - DTO
    // console.log(authDTO);

    return this.authService.register(authDTO);
  }

  @Post('login') // login new user
  login(@Body() authDTO: AuthDTO) {
    return this.authService.login(authDTO);
  }
}
