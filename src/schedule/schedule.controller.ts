import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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

  @Get('id/:id')
  getScheduleById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) scheduleId: number,
  ) {
    return this.scheduleService.getScheduleById(userId, scheduleId);
  }

  @Post()
  insertSchedule(
    @GetUser('id') userId: number,
    @Body() scheduleDTO: ScheduleDTO,
  ) {
    scheduleDTO.userId = userId;
    return this.scheduleService.insertSchedule(scheduleDTO);
  }

  @Patch('id/:id')
  updateSchedule(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) scheduleId: number,
    @Body() scheduleDTO: ScheduleDTO,
  ) {
    return this.scheduleService.updateSchedule(userId, scheduleId, scheduleDTO);
  }

  @Delete('id/:id')
  deleteSchedule(@Param('id', ParseIntPipe) scheduleId: number) {
    return this.scheduleService.deleteSchedule(scheduleId);
  }

  @Get('search')
  searchSchedule(@Query('query') query: string) {
    // console.log(query);
    return this.scheduleService.searchSchedule(query.trim());
  }

  @Get('public')
  getPublicSchedule() {
    // console.log(query);
    return this.scheduleService.getPublicSchedule();
  }

  @Get('inUse')
  getScheduleInUse(@GetUser('id') userId: number) {
    // console.log(query);
    return this.scheduleService.getScheduleInUse(userId);
  }

  @Patch('inUse/:id')
  updateScheduleInUse(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) scheduleId: number,
  ) {
    return this.scheduleService.updateScheduleInUse(userId, scheduleId);
  }

  @Delete('inUse')
  removeScheduleInUse(@GetUser('id') userId: number) {
    return this.scheduleService.removeScheduleInUse(userId);
  }

  @Patch('id/:id/numberOfViews')
  plusNumberOfViews(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) scheduleId: number,
  ) {
    return this.scheduleService.plusNumberOfViews(userId, scheduleId);
  }

  @Patch('id/:id/numberOfCopies')
  plusNumberOfCopies(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) scheduleId: number,
  ) {
    return this.scheduleService.plusNumberOfCopies(userId, scheduleId);
  }
}
