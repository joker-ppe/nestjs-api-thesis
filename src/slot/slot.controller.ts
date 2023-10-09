import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MyJwtGuard } from 'src/auth/guard';

@UseGuards(MyJwtGuard)
// @ApiTags('Day')
@ApiBearerAuth()
@Controller('slot')
export class SlotController {}
