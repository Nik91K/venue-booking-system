import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Establishment } from './entities/establishment.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { RolesGuard, JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('establishment')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create establishment'})
  @ApiOkResponse({ description: "Create success", type: Establishment })
  @ApiBadRequestResponse({ description: "Bad request data" })
  @ApiUnauthorizedResponse({ description: "Not authenticated" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
    return this.establishmentService.create(createEstablishmentDto);
  }

  @Get('reservations')
  @ApiOperation({summary: 'Get all reservations from establishments'})
  @ApiOkResponse({ type: [Establishment] })
  getAllReservation() {
    return this.establishmentService.getAllReservation();
  }

  @Get(':id/comments')
  @ApiOperation({summary: 'Get all comments from establishments'})
  @ApiOkResponse({ description: "Comments retrieved successfully" })
  @ApiNotFoundResponse({ description: 'Establishment not found' })
  getAllComments(@Param('id') id:string) {
    return this.establishmentService.getAllComments(+id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Updating information about establishment'})
  @ApiOkResponse({ type: Establishment })
  @ApiBadRequestResponse({description:'Invalid id'})
  update(@Param('id') id: string, @Body() updateEstablishmentDto: UpdateEstablishmentDto) {
    return this.establishmentService.edit(+id, updateEstablishmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete establishment'})
  @ApiBadRequestResponse({description:'Invalid id'})
  remove(@Param('id') id: string) {
    return this.establishmentService.remove(+id);
  }

  @Post(':id/features/:featureId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Add a single feature to establishment'})
  @ApiOkResponse({ description: 'Feature added successfully', type: Establishment })
  @ApiBadRequestResponse({description: 'Invalid id or feature not found'})
  @ApiNotFoundResponse({description: 'Establishment not found'})
  addFeature(
    @Param('id') id: string,
    @Param('featureId') featureId: string
  ) {
    return this.establishmentService.addFeature(+id, +featureId);
  }

  @Delete(':id/features/:featureId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Remove a single feature from establishment'})
  @ApiOkResponse({ description: 'Feature removed successfully', type: Establishment })
  @ApiBadRequestResponse({description: 'Invalid id'})
  @ApiNotFoundResponse({description: 'Establishment or feature not found'})
  removeFeature(
    @Param('id') id: string,
    @Param('featureId') featureId: string
  ) {
    return this.establishmentService.removeFeature(+id, +featureId);
  }
}
