import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { HistoryService } from 'src/history/history.service';

@Module({
  providers: [ScheduleService, HistoryService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
