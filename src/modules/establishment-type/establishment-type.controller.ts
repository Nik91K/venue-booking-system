import { JwtAuthGuard } from '@common/guard/jwt-auth.guard';
import { RolesGuard } from '@common/guard/jwt-roles.guard';
import { CreateEstablishmentTypeDto } from '@modules/establishment-type/dto/create-establishment-type.dto';
import { UpdateEstablishmentTypeDto } from '@modules/establishment-type/dto/update-establishment-type.dto';
import { EstablishmentType } from '@modules/establishment-type/entities/establishment-type.entity';
import { EstablishmentTypeService } from '@modules/establishment-type/establishment-type.service';
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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { Roles } from '@/common/decorator/roles.decorator';

@ApiTags('Establishment Types')
@Controller('establishment-type')
export class EstablishmentTypeController {
  constructor(
    private readonly establishmentTypeService: EstablishmentTypeService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create establishment type',
    description:
      'Creates a new establishment type. Only SUPER_ADMIN can perform this action.',
  })
  @ApiCreatedResponse({
    description: 'Establishment type created successfully',
    type: EstablishmentType,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - insufficient role' })
  create(@Body() createDto: CreateEstablishmentTypeDto) {
    return this.establishmentTypeService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all establishment types',
    description: 'Returns a list of all establishment types.',
  })
  @ApiOkResponse({
    description: 'List of establishment types',
    type: EstablishmentType,
    isArray: true,
  })
  findAll() {
    return this.establishmentTypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get establishment type by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Establishment type ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Establishment type retrieved successfully',
    type: EstablishmentType,
  })
  @ApiNotFoundResponse({ description: 'Establishment type not found' })
  @ApiBadRequestResponse({ description: 'Invalid ID format' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.establishmentTypeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update establishment type',
    description:
      'Updates an existing establishment type. Only SUPER_ADMIN can update.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Establishment type updated successfully',
    type: EstablishmentType,
  })
  @ApiNotFoundResponse({ description: 'Establishment type not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - insufficient role' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEstablishmentTypeDto
  ) {
    return this.establishmentTypeService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete establishment type',
    description:
      'Deletes an establishment type by ID. Only SUPER_ADMIN can delete.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Establishment type deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Establishment type not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - insufficient role' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.establishmentTypeService.remove(id);
  }
}
