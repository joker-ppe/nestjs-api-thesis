import {
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { MyJwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(MyJwtGuard)
  @ApiBearerAuth()
  @Get()
  getNotification(@GetUser('id') userId: number) {
    return this.notificationService.getNotification(userId);
  }

  @Post()
  sendNotification(
    @Query('apiKey') apiKey: string,
    @Query('userId', ParseIntPipe) userId: number,
    @Query('type', ParseIntPipe) type: number,
    @Query('title') title: string,
    @Query('body') body: string,
  ) {
    return this.notificationService.sendNotification(
      apiKey,
      userId,
      type,
      title,
      body,
    );
  }
}
