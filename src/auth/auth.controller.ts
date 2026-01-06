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
import { UpdateAuthDto } from './dto/update-auth.dto';

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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'Current user profile retrieved' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req.user.userId)
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ description: 'Profile updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  updateCurrentUser(@Request() req, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.updateCurrentUser(req.user.id, updateAuthDto)
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiOkResponse({ description: 'Users retrieved successfully' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  findAll() {
    return this.authService.findAll()
  }

  @Get('users/:id')
  @UseGuards()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({ description: 'User retrieved successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(+id)
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Change user role (admin only)' })
  @ApiOkResponse({ description: 'Role successfully changed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Not enough rights' })
  changeRole(@Param('id') id: string, @Body() changeRoleDto: ChangeRoleDto) {
    return this.authService.changeRole(+id, changeRoleDto.role)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  remove(@Param('id') id: string) {
    return this.authService.deleteUser(+id)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  @ApiOkResponse({ description: 'Logged out successfully' })
  logout(@Request() req) {
    return this.authService.logout(req.user.id)
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiOkResponse({ description: 'Logged out from all devices successfully' })
  logoutAllDevices(@Request() req) {
    return this.authService.logoutAllDevices(req.user.id)
  }
}