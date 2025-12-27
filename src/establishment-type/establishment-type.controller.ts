import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EstablishmentTypeService } from './establishment-type.service';
import { CreateEstablishmentTypeDto } from './dto/create-establishment-type.dto';
import { UpdateEstablishmentTypeDto } from './dto/update-establishment-type.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtAuthGuard, RolesGuard } from 'src/auth/jwt.guard';

@ApiTags('establishment-types')
@Controller('establishment-type')
export class EstablishmentTypeController {
  constructor(private readonly establishmentTypeService: EstablishmentTypeService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create establishment type' })
  create(@Body() createEstablishmentTypeDto: CreateEstablishmentTypeDto) {
    return this.establishmentTypeService.create(createEstablishmentTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all establishment types' })
  findAll() {
    return this.establishmentTypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get establishment type by id' })
  findOne(@Param('id') id: string) {
    return this.establishmentTypeService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update establishment type' })
  update(@Param('id') id: string, @Body() updateEstablishmentTypeDto: UpdateEstablishmentTypeDto) {
    return this.establishmentTypeService.update(+id, updateEstablishmentTypeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete establishment type' })
  remove(@Param('id') id: string) {
    return this.establishmentTypeService.remove(+id);
  }
}
