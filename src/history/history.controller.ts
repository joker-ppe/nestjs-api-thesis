import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MyJwtGuard } from 'src/auth/guard';

@UseGuards(MyJwtGuard)
@ApiTags('History')
@ApiBearerAuth()
@Controller('history')
export class HistoryController {}
