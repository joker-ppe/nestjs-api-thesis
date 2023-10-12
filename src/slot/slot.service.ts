import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SlotService {
  constructor(private prismaService: PrismaService) {}

  async updateSlotStatus(userId: number, slotId: number, statusCode: number) {
    // check status code
    const statuses = await this.prismaService.slotStatus.findMany();

    const isCodeExists = statuses.some((status) => status.id === statusCode);

    if (!isCodeExists) {
      throw new NotFoundException('Invalid status code: ' + statusCode);
    }

    // First, find the user by their userId
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      // Include the user's schedules and the days and slots within those schedules
      include: {
        schedules: {
          include: {
            days: {
              include: {
                slots: true, // Include the slots in the days
              },
            },
          },
        },
      },
    });

    delete user.hashedPassword;

    // Now, you can check if slotId belongs to any of the user's schedules
    const slotExists = user.schedules.some((schedule) =>
      schedule.days.some((day) => day.slots.some((slot) => slot.id === slotId)),
    );

    if (slotExists) {
      return this.prismaService.slot.update({
        where: {
          id: slotId,
        },
        data: {
          status: statusCode,
        },
      });
    } else {
      throw new NotFoundException(
        `Slot does not exist in this user's schedules`,
      );
    }

    // return user;
  }
}
