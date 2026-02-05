import { Roles } from '@common/decorator/roles.decorator';
import { CreateScheduleDto } from '@modules/schedule/dto/create-schedule.dto';
import { UpdateScheduleDto } from '@modules/schedule/dto/update-schedule.dto';
import { Schedule } from '@modules/schedule/entities/schedule.entity';
import { ScheduleService } from '@modules/schedule/schedule.service';
import { UserRole } from '@modules/users/entities/user.entity';
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

import { JwtAuthGuard, RolesGuard } from '@/common/guard/jwt.guard';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('/establishments/:id/schedule')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create schedule' })
  @ApiCreatedResponse({ description: 'Create success', type: Schedule })
  @ApiBadRequestResponse({ description: 'Bad request data' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get('/establishments/:establishmentId/schedule')
  @ApiOperation({ summary: 'Get schedule for establishment' })
  @ApiOkResponse({ description: 'Success', type: Schedule })
  @ApiBadRequestResponse({ description: 'Bad request data' })
  findByEstablishment(@Param('establishmentId') establishmentId: string) {
    return this.scheduleService.findByEstablishment(+establishmentId);
  }

  @Patch('/schedule/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update schedule' })
  @ApiOkResponse({ description: 'Updated success', type: Schedule })
  @ApiBadRequestResponse({ description: 'Bad request data' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto
  ) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  @Delete('/schedule/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete schedule' })
  @ApiBadRequestResponse({ description: 'Bad request data' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @Roles(UserRole.OWNER, UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
