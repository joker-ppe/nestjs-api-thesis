import { ForbiddenException, Injectable } from '@nestjs/common';
import { InsertScheduleDTO, UpdateScheduleDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prismaService: PrismaService) {}

  getSchedules(userId: number) {
    const schedules = this.prismaService.schedule.findMany({
      where: {
        userId: userId,
      },
    });
    return schedules;
  }

  getScheduleById(scheduleId: number) {
    const schedule = this.prismaService.schedule.findUnique({
      where: {
        id: scheduleId,
      },
    });
    return schedule;
  }

  async insertSchedule(userId: number, insertScheduleDTO: InsertScheduleDTO) {
    const schedule = await this.prismaService.schedule.create({
      data: {
        ...insertScheduleDTO,
        userId,
      },
    });

    return schedule;
  }

  updateSchedule(scheduleId: number, updateScheduleDTO: UpdateScheduleDTO) {
    const schedule = this.prismaService.schedule.findUnique({
      where: {
        id: scheduleId,
      },
    });

    if (!schedule) {
      throw new ForbiddenException('Schedule is not exist.');
    }

    return this.prismaService.schedule.update({
      where: {
        id: scheduleId,
      },
      data: { ...updateScheduleDTO },
    });
  }
}
