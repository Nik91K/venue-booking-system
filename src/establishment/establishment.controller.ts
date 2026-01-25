import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { EstablishmentService } from './establishment.service';

import { Roles } from '@/auth/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/user.decorator';
import { RolesGuard, JwtAuthGuard } from '@/auth/jwt.guard';
import { Establishment } from '@/establishment/entities/establishment.entity';
import { PageOptionsDto } from '@/pagination/dto/page-options.dto';
import { PageDto } from '@/pagination/dto/page.dto';
import { User, UserRole } from '@/users/entities/user.entity';

@Controller('establishment')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create establishment' })
  @ApiOkResponse({ description: 'Create success', type: Establishment })
  @ApiBadRequestResponse({ description: 'Bad request data' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  create(
    @Body() createEstablishmentDto: CreateEstablishmentDto,
    @CurrentUser() user: User
  ) {
    return this.establishmentService.create(createEstablishmentDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all establishments' })
  @ApiOkResponse({ description: 'List of all establishments', type: PageDto })
  getAllEstablishments(
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<Establishment>> {
    return this.establishmentService.getAllEstablishments(pageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get establishment by ID' })
  @ApiOkResponse({ description: 'Establishment details', type: Establishment })
  @ApiNotFoundResponse({ description: 'Establishment not found' })
  getEstablishmentById(@Param('id') id: string) {
    return this.establishmentService.getEstablishmentById(+id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get all comments from establishment' })
  @ApiOkResponse({ description: 'Comments retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Establishment not found' })
  getAllComments(@Param('id') id: string) {
    return this.establishmentService.getAllComments(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update establishment information' })
  @ApiOkResponse({ type: Establishment })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  update(
    @Param('id') id: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto
  ) {
    return this.establishmentService.edit(+id, updateEstablishmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete establishment' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  remove(@Param('id') id: string) {
    return this.establishmentService.remove(+id);
  }

  @Post(':id/features/:featureId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a single feature to establishment' })
  @ApiOkResponse({
    description: 'Feature added successfully',
    type: Establishment,
  })
  @ApiBadRequestResponse({ description: 'Invalid id or feature not found' })
  @ApiNotFoundResponse({ description: 'Establishment not found' })
  addFeature(@Param('id') id: string, @Param('featureId') featureId: string) {
    return this.establishmentService.addFeature(+id, +featureId);
  }

  @Delete(':id/features/:featureId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a single feature from establishment' })
  @ApiOkResponse({
    description: 'Feature removed successfully',
    type: Establishment,
  })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Establishment or feature not found' })
  removeFeature(
    @Param('id') id: string,
    @Param('featureId') featureId: string
  ) {
    return this.establishmentService.removeFeature(+id, +featureId);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add establishment to user favorites' })
  @ApiOkResponse({ description: 'Establishment added to favorites' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Establishment not found' })
  addFavorite(@Param('id') id: string, @CurrentUser() user: User) {
    return this.establishmentService.addFavorite(user.id, +id);
  }
}
