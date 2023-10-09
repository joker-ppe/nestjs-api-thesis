import { ForbiddenException, Injectable } from '@nestjs/common';
import { ScheduleDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prismaService: PrismaService) {}

  async getSchedules(userId: number) {
    const schedules = await this.prismaService.schedule.findMany({
      where: {
        userId: userId,
      },
      include: {
        days: {
          include: {
            slots: true,
          },
        },
      },
    });
    return schedules;
  }

  async getScheduleById(scheduleId: number) {
    const schedule = await this.prismaService.schedule.findUnique({
      where: {
        id: scheduleId,
      },
      include: {
        days: {
          include: {
            slots: true,
          },
        },
      },
    });

    if (!schedule) {
      throw new ForbiddenException('Schedule is not exist.');
    }

    return schedule;
  }

  async insertSchedule(scheduleDTO: ScheduleDTO) {
    const schedule = await this.prismaService.schedule.create({
      data: {
        title: scheduleDTO.title,
        description: scheduleDTO.description,
        userId: scheduleDTO.userId,
        days: {
          create: scheduleDTO.days.map((dayDTO) => ({
            title: dayDTO.title,
            slots: {
              create: dayDTO.slots.map((slotDTO) => ({
                startTime: slotDTO.startTime,
                endTime: slotDTO.endTime,
              })),
            },
          })),
        },
      },
    });

    return schedule;
  }

  async updateSchedule(scheduleId: number, scheduleDTO: ScheduleDTO) {
    const schedule = await this.prismaService.schedule.findUnique({
      where: {
        id: scheduleId,
      },
    });

    if (!schedule) {
      throw new ForbiddenException('Schedule is not exist.');
    }

    // delete old data of days and slots

    await this.prismaService.slot.deleteMany({
      where: {
        day: {
          scheduleId: scheduleId,
        },
      },
    });

    await this.prismaService.day.deleteMany({
      where: {
        scheduleId: scheduleId,
      },
    });

    return await this.prismaService.schedule.update({
      where: {
        id: scheduleId,
      },
      data: {
        title: scheduleDTO.title,
        description: scheduleDTO.description,
        userId: scheduleDTO.userId,
        days: {
          create: scheduleDTO.days.map((dayDTO) => ({
            title: dayDTO.title,
            slots: {
              create: dayDTO.slots.map((slotDTO) => ({
                startTime: slotDTO.startTime,
                endTime: slotDTO.endTime,
              })),
            },
          })),
        },
      },
    });
  }
}
