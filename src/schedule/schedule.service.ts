import {
  DateInScheduleInUseDTO,
  SlotInScheduleInUseDTO,
} from './dto/schedule.dto';
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
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    let scheduleIdInUse = 0;
    if (!user.scheduleIdInUse) {
      scheduleIdInUse = user.scheduleIdInUse;
    }

    const schedules = await this.prismaService.schedule.findMany({
      where: {
        userId: userId,
        // get schedules have status active only
        isActive: true,
        id: {
          not: scheduleIdInUse,
        },
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
        scheduleInUseData: true,
      },
    });

    if (user) {
      const scheduleInUse = JSON.parse(user.scheduleInUseData);

      if (!scheduleInUse) {
        throw new NotFoundException(
          `User '${user.userName}' does not apply any schedule`,
        );
      }

      return scheduleInUse;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async updateScheduleInUse(userId: number, scheduleId: number) {
    const schedules = await this.getSchedules(userId);

    const inUsedSchedule = schedules.find(
      (schedule) => schedule.id === scheduleId,
    );

    if (!inUsedSchedule) {
      throw new NotFoundException('Schedule is not belonged to this user');
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const listDateData = new Array<DateInScheduleInUseDTO>();

    for (let i = 0; i < inUsedSchedule.numberOfDates; i++) {
      const dateData = new DateInScheduleInUseDTO();
      dateData.index = i + 1;
      dateData.slots = new Array<SlotInScheduleInUseDTO>();

      for (let j = 0; j < inUsedSchedule.slots.length; j++) {
        const slotData = new SlotInScheduleInUseDTO();
        slotData.index = j + 1;
        slotData.status = SlotStatus.NOT_YET;

        dateData.slots.push(slotData);
      }

      listDateData.push(dateData);
    }

    inUsedSchedule['registrationDate'] = today;
    inUsedSchedule['startedDate'] = tomorrow;
    inUsedSchedule['listDateData'] = listDateData;

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        scheduleIdInUse: scheduleId,
        scheduleInUseData: JSON.stringify(inUsedSchedule),
      },
      select: {
        id: true,
        userName: true,
        scheduleIdInUse: true,
        scheduleInUseData: false,
      },
    });

    return inUsedSchedule;
  }

  async removeScheduleInUse(userId: number) {
    const scheduleInUse = await this.getScheduleInUse(userId);

    if (!scheduleInUse) {
      throw new NotFoundException('Schedule in use is not exist.');
    }

    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        scheduleIdInUse: null,
        scheduleInUseData: null,
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

    if (schedule.userId === userId) {
      return schedule;
    } else {
      return this.prismaService.schedule.update({
        where: {
          id: scheduleId,
        },
        data: {
          numberOfViews: schedule.numberOfViews + 1,
        },
      });
    }

    // const schedules = await this.getSchedules(userId);

    // const isScheduleIdInList = schedules.some(
    //   (schedule) => schedule.id === scheduleId,
    // );

    // if (!isScheduleIdInList) {
    //   throw new NotFoundException('Schedule is not belonged to this user');
    // }

    // console.log(schedule.numberOfViews + 1);
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

    if (schedule.userId === userId) {
      return schedule;
    } else {
      return this.prismaService.schedule.update({
        where: {
          id: scheduleId,
        },
        data: {
          numberOfCopies: schedule.numberOfCopies + 1,
        },
      });
    }

    // const schedules = await this.getSchedules(userId);

    // const isScheduleIdInList = schedules.some(
    //   (schedule) => schedule.id === scheduleId,
    // );

    // if (!isScheduleIdInList) {
    //   throw new NotFoundException('Schedule is not belonged to this user');
    // }
  }
}
