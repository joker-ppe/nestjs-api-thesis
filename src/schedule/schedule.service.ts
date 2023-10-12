import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ScheduleDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prismaService: PrismaService) {}

  async getSchedules(userId: number) {
    const schedules = await this.prismaService.schedule.findMany({
      where: {
        userId: userId,
        // get schedules have status active only
        isActive: true,
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

  async getScheduleById(userId: number, scheduleId: number) {
    const schedule = await this.prismaService.schedule.findUnique({
      where: {
        id: scheduleId,
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

    if (!schedule) {
      throw new NotFoundException('Schedule is not exist.');
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

  async updateSchedule(
    userId: number,
    scheduleId: number,
    scheduleDTO: ScheduleDTO,
  ) {
    const schedule = await this.prismaService.schedule.findUnique({
      where: {
        id: scheduleId,
      },
    });

    if (!schedule) {
      throw new ForbiddenException('Schedule is not exist.');
    }

    const schedules = await this.getSchedules(userId);

    const isScheduleIdInList = schedules.some(
      (schedule) => schedule.id === scheduleId,
    );

    if (!isScheduleIdInList) {
      throw new NotFoundException('Schedule is not belonged to this user');
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

  async deleteSchedule(scheduleId: number) {
    const schedule = await this.prismaService.schedule.findUnique({
      where: {
        id: scheduleId,
      },
    });

    if (!schedule) {
      throw new ForbiddenException('Schedule is not exist.');
    }

    return await this.prismaService.schedule.update({
      where: {
        id: scheduleId,
      },
      data: {
        isActive: false,
      },
    });
  }

  async searchSchedule(query: string) {
    const schedules = await this.prismaService.schedule.findMany({
      where: {
        title: {
          contains: query,
        },
        isActive: true,
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

  async getScheduleInUse(userId: number) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        userName: true,
        scheduleIdInUse: true,
      },
    });

    if (user) {
      const scheduleIdInUse = user.scheduleIdInUse;

      if (!scheduleIdInUse) {
        throw new NotFoundException(
          `User '${user.userName}' does not apply any schedule`,
        );
      }

      const scheduleInUse = await this.prismaService.schedule.findUniqueOrThrow(
        {
          where: {
            id: scheduleIdInUse,
          },
          include: {
            days: {
              include: {
                slots: true,
              },
            },
          },
        },
      );

      return scheduleInUse;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async updateScheduleInUse(userId: number, scheduleId: number) {
    const schedules = await this.getSchedules(userId);

    const isScheduleIdInList = schedules.some(
      (schedule) => schedule.id === scheduleId,
    );

    if (isScheduleIdInList) {
      return await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          scheduleIdInUse: scheduleId,
        },
        select: {
          userName: true,
          scheduleIdInUse: true,
        },
      });
    } else {
      throw new NotFoundException('Schedule is not belonged to this user');
    }
  }

  async removeScheduleInUse(userId: number) {
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        scheduleIdInUse: null,
      },
      select: {
        userName: true,
        scheduleIdInUse: true,
      },
    });
  }

  async plusNumberOfViews(userId: number, scheduleId: number) {
    const schedule = await this.prismaService.schedule.findUnique({
      where: {
        id: scheduleId,
      },
    });

    if (!schedule) {
      throw new ForbiddenException('Schedule is not exist.');
    }

    const schedules = await this.getSchedules(userId);

    const isScheduleIdInList = schedules.some(
      (schedule) => schedule.id === scheduleId,
    );

    if (!isScheduleIdInList) {
      throw new NotFoundException('Schedule is not belonged to this user');
    }

    // console.log(schedule.numberOfViews + 1);

    return this.prismaService.schedule.update({
      where: {
        id: scheduleId,
      },
      data: {
        numberOfViews: schedule.numberOfViews + 1,
      },
    });
  }

  async plusNumberOfCopies(userId: number, scheduleId: number) {
    const schedule = await this.prismaService.schedule.findUnique({
      where: {
        id: scheduleId,
      },
    });

    if (!schedule) {
      throw new ForbiddenException('Schedule is not exist.');
    }

    const schedules = await this.getSchedules(userId);

    const isScheduleIdInList = schedules.some(
      (schedule) => schedule.id === scheduleId,
    );

    if (!isScheduleIdInList) {
      throw new NotFoundException('Schedule is not belonged to this user');
    }

    return this.prismaService.schedule.update({
      where: {
        id: scheduleId,
      },
      data: {
        numberOfCopies: schedule.numberOfCopies + 1,
      },
    });
  }
}
