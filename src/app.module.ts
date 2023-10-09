import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
// import { ScheduleController } from './schedule/schedule.controller';
import { ScheduleModule } from './schedule/schedule.module';
import { DayModule } from './day/day.module';
import { SlotModule } from './slot/slot.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ScheduleModule,
    DayModule,
    SlotModule,
    HistoryModule,
  ],
  // controllers: [DayController, SlotController, HistoryController],
  // providers: [DayService, SlotService, HistoryService],
  // controllers: [],
})
export class AppModule {}
