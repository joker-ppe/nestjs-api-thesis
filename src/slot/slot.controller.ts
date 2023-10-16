import {
  Controller,
  Param,
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

  @Patch(':id/status')
  updateSlotStatus(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) slotId: number,

    @Query('statusCode', ParseIntPipe)
    statusCode: number,
  ) {
    return this.slotService.updateSlotStatus(userId, slotId, statusCode);
  }
}
