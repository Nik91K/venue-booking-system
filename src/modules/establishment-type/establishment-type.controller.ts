import { JwtAuthGuard } from '@common/guard/jwt-auth.guard';
import { RolesGuard } from '@common/guard/jwt-roles.guard';
import { CreateEstablishmentTypeDto } from '@modules/establishment-type/dto/create-establishment-type.dto';
import { UpdateEstablishmentTypeDto } from '@modules/establishment-type/dto/update-establishment-type.dto';
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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '@/common/decorator/roles.decorator';

@ApiTags('establishment-types')
@Controller('establishment-type')
export class EstablishmentTypeController {
  constructor(
    private readonly establishmentTypeService: EstablishmentTypeService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create establishment type' })
  @ApiCreatedResponse({
    description: 'Establishment type created successfully',
  })
  create(@Body() createEstablishmentTypeDto: CreateEstablishmentTypeDto) {
    return this.establishmentTypeService.create(createEstablishmentTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all establishment types' })
  @ApiOkResponse({ description: 'List of all establishment types' })
  findAll() {
    return this.establishmentTypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get establishment type by id' })
  @ApiOkResponse({ description: 'Establishment type retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.establishmentTypeService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update establishment type' })
  @ApiOkResponse({ description: 'Establishment type updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateEstablishmentTypeDto: UpdateEstablishmentTypeDto
  ) {
    return this.establishmentTypeService.update(
      +id,
      updateEstablishmentTypeDto
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete establishment type' })
  @ApiOkResponse({ description: 'Establishment type deleted successfully' })
  remove(@Param('id') id: string) {
    return this.establishmentTypeService.remove(+id);
  }
}
