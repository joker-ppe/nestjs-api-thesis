import { HistoryService } from './../history/history.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleDTO, SlotStatus } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(
    private prismaService: PrismaService,
    private historyService: HistoryService,
  ) {}

  async getSchedules(userId: number) {
    const schedules = await this.prismaService.schedule.findMany({
      where: {
        userId: userId,
        // get schedules have status active only
        isActive: true,
      },
      orderBy: {
        updateContentAt: 'desc', // Order by updateAt in descending order
      },
      include: {
        slots: true,
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
        slots: true,
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
        plantName: scheduleDTO.plantName,
        isPublic: scheduleDTO.isPublic,
        imageData: scheduleDTO.imageData,
        numberOfDates: scheduleDTO.numberOfDates,
        longitude: scheduleDTO.longitude,
        latitude: scheduleDTO.latitude,
        moistureThreshold: scheduleDTO.moistureThreshold,
        temperatureThreshold: scheduleDTO.temperatureThreshold,
        ecThreshold: scheduleDTO.ecThreshold,
        pHThreshold: scheduleDTO.pHThreshold,
        nThreshold: scheduleDTO.nThreshold,
        pThreshold: scheduleDTO.pThreshold,
        kThreshold: scheduleDTO.kThreshold,
        userId: scheduleDTO.userId,
        updateContentAt: new Date(),
        slots: {
          create: scheduleDTO.slots.map((slotDTO) => ({
            startTime: slotDTO.startTime,
            endTime: slotDTO.endTime,
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
      throw new NotFoundException('Schedule is not exist.');
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
        plantName: scheduleDTO.plantName,
        isPublic: scheduleDTO.isPublic,
        imageData: scheduleDTO.imageData,
        numberOfDates: scheduleDTO.numberOfDates,
        longitude: scheduleDTO.longitude,
        latitude: scheduleDTO.latitude,
        moistureThreshold: scheduleDTO.moistureThreshold,
        temperatureThreshold: scheduleDTO.temperatureThreshold,
        ecThreshold: scheduleDTO.ecThreshold,
        pHThreshold: scheduleDTO.pHThreshold,
        nThreshold: scheduleDTO.nThreshold,
        pThreshold: scheduleDTO.pThreshold,
        kThreshold: scheduleDTO.kThreshold,
        updateContentAt: new Date(),
        userId: scheduleDTO.userId,
        slots: {
          create: scheduleDTO.slots.map((slotDTO) => ({
            startTime: slotDTO.startTime,
            endTime: slotDTO.endTime,
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
      throw new NotFoundException('Schedule is not exist.');
    }

    const userInUse = await this.prismaService.user.findMany({
      where: {
        scheduleIdInUse: scheduleId,
      },
    });

    if (userInUse.length != 0) {
      throw new NotFoundException('Schedule is in using.');
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
        isPublic: true,
      },
      orderBy: {
        updateAt: 'desc', // Order by updateAt in descending order
      },
      select: {
        id: true,
        title: true,
        description: true,
        numberOfViews: true,
        numberOfCopies: true,
        imageData: true,
        numberOfDates: true,
        longitude: true,
        latitude: true,
        moistureThreshold: true,
        temperatureThreshold: true,
        ecThreshold: true,
        pHThreshold: true,
        nThreshold: true,
        pThreshold: true,
        kThreshold: true,
        createAt: true,
        updateAt: true,
        slots: true,
        userId: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            photoUrl: true,
          },
        },
      },
    });

    return schedules;
  }

  async getPublicSchedule() {
    const schedules = await this.prismaService.schedule.findMany({
      where: {
        isActive: true,
        isPublic: true,
      },
      orderBy: {
        updateAt: 'desc', // Order by updateAt in descending order
      },
      select: {
        id: true,
        title: true,
        description: true,
        numberOfViews: true,
        numberOfCopies: true,
        isPublic: true,
        isActive: true,
        imageData: true,
        numberOfDates: true,
        longitude: true,
        latitude: true,
        moistureThreshold: true,
        temperatureThreshold: true,
        ecThreshold: true,
        pHThreshold: true,
        nThreshold: true,
        pThreshold: true,
        kThreshold: true,
        createAt: true,
        updateAt: true,
        updateContentAt: true,
        slots: true,
        userId: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            photoUrl: true,
          },
        },
      },
    });

    return schedules;
  }

  async getScheduleInUse(userId: number) {
    const user = await this.prismaService.user.findUnique({
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

      const scheduleInUse = await this.prismaService.schedule.findUnique({
        where: {
          id: scheduleIdInUse,
        },
        include: {
          slots: true,
        },
      });

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
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          userName: true,
          scheduleIdInUse: true,
        },
      });

      if (user.scheduleIdInUse) {
        if (user.scheduleIdInUse != scheduleId) {
          const totalSlotsCount = await this.prismaService.slot.count({
            where: {
              scheduleId: user.scheduleIdInUse,
            },
          });

          const statusDoneSlotsCount =
            await this.prismaService.slotStatus.count({
              where: {
                slot: {
                  scheduleId: user.scheduleIdInUse,
                },
                status: SlotStatus.Done,
              },
            });

          if (totalSlotsCount === 0) {
            return 0; // To avoid division by zero
          }

          const percentage = (statusDoneSlotsCount * 100) / totalSlotsCount;

          // add history
          await this.historyService.markHistoryAsCompleted(
            userId,
            user.scheduleIdInUse,
            percentage,
          );

          // add history
          await this.historyService.insertNewHistory(userId, scheduleId);
        }
      } else {
        // add history
        await this.historyService.insertNewHistory(userId, scheduleId);
      }

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
    const scheduleInUse = await this.getScheduleInUse(userId);

    const totalSlotsCount = await this.prismaService.slot.count({
      where: {
        scheduleId: scheduleInUse.id,
      },
    });

    const statusDoneSlotsCount = await this.prismaService.slotStatus.count({
      where: {
        slot: {
          scheduleId: scheduleInUse.id,
        },
        status: SlotStatus.Done,
      },
    });

    if (totalSlotsCount === 0) {
      return 0; // To avoid division by zero
    }

    const percentage = (statusDoneSlotsCount * 100) / totalSlotsCount;

    // add history
    await this.historyService.markHistoryAsCompleted(
      userId,
      scheduleInUse.id,
      percentage,
    );

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
      throw new NotFoundException('Schedule is not exist.');
    }

    // const schedules = await this.getSchedules(userId);

    // const isScheduleIdInList = schedules.some(
    //   (schedule) => schedule.id === scheduleId,
    // );

    // if (!isScheduleIdInList) {
    //   throw new NotFoundException('Schedule is not belonged to this user');
    // }

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
      throw new NotFoundException('Schedule is not exist.');
    }

    // const schedules = await this.getSchedules(userId);

    // const isScheduleIdInList = schedules.some(
    //   (schedule) => schedule.id === scheduleId,
    // );

    // if (!isScheduleIdInList) {
    //   throw new NotFoundException('Schedule is not belonged to this user');
    // }

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
