import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { isSlotStatus } from 'src/schedule/dto';

@Injectable()
export class SlotService {
  constructor(private prismaService: PrismaService) {}

  async updateSlotStatus(
    userId: number,
    scheduleId: number,
    dayIndex: number,
    slotIndex: number,
    note: string,
    status: string,
  ) {
    // First, find the user by their userId
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
        scheduleIdInUse: scheduleId,
      },
    });

    if (!user) {
      throw new NotFoundException('User do not have schedule in use.');
    }

    const scheduleInUse = JSON.parse(user.scheduleInUseData);

    if (dayIndex < 1 || dayIndex > scheduleInUse['listDateData'].length) {
      throw new NotFoundException('Invalid day index');
    }

    // console.log(scheduleInUse['slots'].length);

    if (slotIndex < 1 || slotIndex > scheduleInUse['slots'].length) {
      throw new NotFoundException('Invalid slot index');
    }

    // check enum
    if (!isSlotStatus(status)) {
      throw new NotFoundException('Invalid slot status');
    }

    const slot =
      scheduleInUse['listDateData'][dayIndex - 1]['slots'][slotIndex - 1];

    // console.log(slot);
    slot['status'] = status;

    if (note && note.length > 0) {
      slot['note'] = note;
    }
    // return user;

    const listDateData = scheduleInUse['listDateData'];
    listDateData[dayIndex - 1]['slots'][slotIndex - 1] = slot;

    scheduleInUse['listDateData'] = listDateData;

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        scheduleInUseData: JSON.stringify(scheduleInUse),
      },
    });

    return slot;
  }
}
