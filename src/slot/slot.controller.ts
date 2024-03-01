import {
  Controller,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MyJwtGuard } from 'src/auth/guard';
import { SlotService } from './slot.service';
import { GetUser } from 'src/auth/decorator';

@UseGuards(MyJwtGuard)
@ApiTags('Slot')
@ApiBearerAuth()
@Controller('slot')
export class SlotController {
  constructor(private slotService: SlotService) {}

  @Patch('status')
  updateSlotStatus(
    @GetUser('id') userId: number,
    @Query('scheduleId', ParseIntPipe) scheduleId: number,
    @Query('dayIndex', ParseIntPipe) dayIndex: number,
    @Query('slotIndex', ParseIntPipe) slotIndex: number,
    @Query('note') note: string,

    @Query('status')
    status: string,
  ) {
    return this.slotService.updateSlotStatus(
      userId,
      scheduleId,
      dayIndex,
      slotIndex,
      note,
      status,
    );
  }
}
