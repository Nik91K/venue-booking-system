import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiConflictResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from './jwt.guard';
import { LoginDto } from './dto/login.dto';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from './decorators/roles.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: "Create new user" })
  @ApiOkResponse({ description: "User created" })
  @ApiConflictResponse({ description: "Email already in use" })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto)
  }

  @Post('login')
  @ApiOperation({ summary: "Login user" })
  @ApiOkResponse({ description: "Login successful" })
  @ApiNotFoundResponse({ description: "User not found" })
  login(@Body() loginAuthDto: LoginDto) {
    return this.authService.login(loginAuthDto)
  }

  @Post('refresh')
  @ApiOperation({ summary: "Refresh access token" })
  @ApiOkResponse({ description: "Token refreshed successfully" })
  @ApiUnauthorizedResponse({ description: "Invalid refresh token" })
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken)
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUBER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Users retrieved successfully' })
  findAll() {
    return this.authService.findAll()
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.SUBER_ADMIN)
  @ApiOperation({ summary: 'Change user role' })
  @ApiOkResponse({ description: 'Role successfully changed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Not enough rights' })
  changeRole(@Param('id') id: number, @Body() changeRoleDto: ChangeRoleDto ) {
    return this.authService.changeRole(id, changeRoleDto.role)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUBER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  remove(@Param('id') id: number) {
    return this.authService.deleteUser(id)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  @ApiOkResponse({ description: 'Logged out successfully' })
  logout(@Request() request) {
    return this.authService.logout(request.user.userId)
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiOkResponse({ description: 'Logged out from all devices successfully' })
  logoutAllDevices(@Request() request) {
    return this.authService.logoutAllDevices(request.user.userId);
  }
}
