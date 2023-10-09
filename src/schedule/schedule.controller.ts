import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MyJwtGuard } from '../auth/guard';
import { ScheduleService } from './schedule.service';
import { ScheduleDTO } from './dto';
import { GetUser } from '../auth/decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(MyJwtGuard)
@ApiTags('Schedule')
@ApiBearerAuth()
@Controller('schedules')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  getSchedules(@GetUser('id') userId: number) {
    return this.scheduleService.getSchedules(userId);
  }

  @Get(':id')
  getScheduleById(@Param('id', ParseIntPipe) scheduleId: number) {
    return this.scheduleService.getScheduleById(scheduleId);
  }

  @Post()
  insertSchedule(
    @GetUser('id') userId: number,
    @Body() scheduleDTO: ScheduleDTO,
  ) {
    scheduleDTO.userId = userId;
    return this.scheduleService.insertSchedule(scheduleDTO);
  }

  @Patch(':id')
  updateSchedule(
    @Param('id', ParseIntPipe) scheduleId: number,
    @Body() scheduleDTO: ScheduleDTO,
  ) {
    return this.scheduleService.updateSchedule(scheduleId, scheduleDTO);
  }
}
