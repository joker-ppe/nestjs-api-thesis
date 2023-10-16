import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prismaService: PrismaService) {}

  async getHistoryByUserId(userId: number) {
    return await this.prismaService.history.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        startTime: 'desc',
      },
    });
  }

  async insertNewHistory(userId: number, scheduleId: number) {
    // check schedule exists
    const userSchedule = await this.prismaService.schedule.findUnique({
      where: {
        id: scheduleId,
      },
    });

    if (!userSchedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    // get current history
    const currentHistory = await this.prismaService.history.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    if (currentHistory) {
      if (!currentHistory.isCompleted) {
        throw new BadRequestException(`User had applied schedule already`);
      }
    }

    return await this.prismaService.history.create({
      data: {
        userId: userId,
        scheduleId: scheduleId,
      },
    });
  }

  async markHistoryAsCompleted(
    userId: number,
    scheduleId: number,
    progress: number,
  ) {
    // check schedule exists
    const userSchedule = await this.prismaService.schedule.findUnique({
      where: {
        id: scheduleId,
      },
    });

    if (!userSchedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    // get current history
    const currentHistory = await this.prismaService.history.findFirst({
      where: {
        userId: userId,
        scheduleId: scheduleId,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    if (!currentHistory) {
      throw new NotFoundException(`History not found`);
    }

    return await this.prismaService.history.update({
      where: {
        id: currentHistory.id,
      },
      data: {
        isCompleted: true,
        progress: progress,
      },
    });
  }
}
