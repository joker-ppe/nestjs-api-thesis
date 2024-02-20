import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/user.decorator';
// import { AuthGuard } from '@nestjs/passport';
import { MyJwtGuard } from '../auth/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  //   @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Get('profile')
  me(@GetUser() user: User) {
    return user;
  }

  @Get('encrypt')
  encrypt(@Query('textData') textData: string) {
    return this.userService.encryptData(textData);
  }

  @Get('decrypt')
  decrypt(@Query('encryptedData') encryptedData: string) {
    return this.userService.decryptData(encryptedData);
  }
}
