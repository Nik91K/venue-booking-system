import { CreateEstablishmentDto } from '@modules/establishment/dto/create-establishment.dto';
import { UpdateEstablishmentDto } from '@modules/establishment/dto/update-establishment.dto';
import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { EstablishmentService } from '@modules/establishment/establishment.service';
import { User, UserRole } from '@modules/users/entities/user.entity';
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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from '@/common/decorator/roles.decorator';
import { CurrentUser } from '@/common/decorator/user.decorator';
import { RolesGuard, JwtAuthGuard } from '@/common/guard/jwt.guard';
import { PageOptionsDto } from '@/pagination/dto/page-options.dto';
import { PageDto } from '@/pagination/dto/page.dto';

@Controller('establishment')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create establishment' })
  @ApiCreatedResponse({ description: 'Create success', type: Establishment })
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

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all favorite establishments for the current user',
  })
  @ApiOkResponse({
    description: 'Favorite establishments retrieved successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Favorites not found' })
  getAllFavorites(@CurrentUser() user: User) {
    return this.establishmentService.getAllFavorites(user.id);
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
  @ApiOkResponse({
    description: 'Establishment updated successfully',
    type: Establishment,
  })
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
  @ApiCreatedResponse({ description: 'Establishment added to favorites' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Establishment not found' })
  addFavorite(@Param('id') id: string, @CurrentUser() user: User) {
    return this.establishmentService.addFavorite(user.id, +id);
  }

  @Delete(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove establishment from user favorites' })
  @ApiOkResponse({ description: 'Establishment removed from favorites' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'Establishment not found' })
  removeFavorite(@Param('id') id: string, @CurrentUser() user: User) {
    return this.establishmentService.removeFavorite(user.id, +id);
  }
}
