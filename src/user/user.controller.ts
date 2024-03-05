import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
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

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Patch('cabinet/:id')
  setCabin(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) cabinetId: number,
    @Query('accessToken') accessToken: string,
  ) {
    return this.userService.updateDevice(userId, cabinetId, accessToken);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Delete('cabinet')
  removeCabin(@GetUser('id') userId: number) {
    return this.userService.removeDevice(userId);
  }

  @Get('renewAccessToken')
  renewAccessToken(
    @Query('apiKey') apiKey: string,
    @Query('userId', ParseIntPipe) userId: number,
    @Query('cabinetId', ParseIntPipe) cabinetId: number,
    @Query('oldAccessToken') oldAccessToken: string,
  ) {
    return this.userService.renewAccessToken(
      apiKey,
      userId,
      cabinetId,
      oldAccessToken,
    );
  }

  @Get('encrypt')
  encrypt(
    @Query('apiKey') apiKey: string,
    @Query('textData') textData: string,
  ) {
    return this.userService.encryptData(apiKey, textData);
  }

  @Get('decrypt')
  decrypt(
    @Query('apiKey') apiKey: string,
    @Query('encryptedData') encryptedData: string,
  ) {
    return this.userService.decryptData(apiKey, encryptedData);
  }
}
