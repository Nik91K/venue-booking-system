import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from '@/common/decorator/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@/common/guard/jwt.guard';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { UserRole } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'Current user profile retrieved' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  getCurrentUser(@Request() req) {
    return this.usersService.getCurrentUser(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ description: 'Profile updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  updateCurrentUser(@Request() req, @Body() updateAuthDto: UpdateUserDto) {
    return this.usersService.updateCurrentUser(req.user.id, updateAuthDto);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiOkResponse({ description: 'Users retrieved successfully' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('users/:id')
  @UseGuards()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({ description: 'User retrieved successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(+id);
  }
}
