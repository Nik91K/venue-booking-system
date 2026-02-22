import { EstablishmentOwnerGuard } from '@common/guard/establishment-owner.guard';
import { JwtAuthGuard } from '@common/guard/jwt.guard';
import { CreateSchedulesDto } from '@modules/schedule/dto/create-schedule.dto';
import { UpdateSingleScheduleDto } from '@modules/schedule/dto/update-schedule.dto';
import { Schedule } from '@modules/schedule/entities/schedule.entity';
import { ScheduleService } from '@modules/schedule/schedule.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, EstablishmentOwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create schedule' })
  @ApiCreatedResponse({
    description: 'Create success',
    type: [Schedule],
  })
  @ApiBadRequestResponse({ description: 'Bad request data' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  create(@Body() createSchedulesDto: CreateSchedulesDto) {
    return this.scheduleService.create(createSchedulesDto);
  }

  @Get(':establishmentId')
  @ApiOperation({ summary: 'Get schedule for establishment' })
  @ApiOkResponse({ description: 'Success', type: Schedule })
  @ApiBadRequestResponse({ description: 'Bad request data' })
  findByEstablishment(@Param('establishmentId') establishmentId: string) {
    return this.scheduleService.findByEstablishment(+establishmentId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, EstablishmentOwnerGuard)
  @ApiOperation({ summary: 'Update schedule' })
  @ApiOkResponse({ description: 'Updated success', type: Schedule })
  @ApiBadRequestResponse({ description: 'Bad request data' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  update(
    @Param('id') id: string,
    @Body() updateSingleScheduleDto: UpdateSingleScheduleDto
  ) {
    return this.scheduleService.update(+id, updateSingleScheduleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, EstablishmentOwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete schedule' })
  @ApiBadRequestResponse({ description: 'Bad request data' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
