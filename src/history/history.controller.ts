import { Controller, Get, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { GetUser } from 'src/auth/decorator';
import { MyJwtGuard } from '../auth/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(MyJwtGuard)
@ApiTags('History')
@ApiBearerAuth()
@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  // @Get()
  // getHistory(@GetUser('id') userId: number) {
  //   return this.historyService.getHistoryByUserId(userId);
  // }

  // @Post()
  // insertHistory(
  //   @GetUser('id') userId: number,
  //   @Query('scheduleId', ParseIntPipe) scheduleId: number,
  // ) {
  //   return this.historyService.insertNewHistory(userId, scheduleId);
  // }
}
