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
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from 'src/users/entities/user.entity';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

import { Roles } from '@/common/decorator/roles.decorator';
import { CurrentUser } from '@/common/decorator/user.decorator';
import { JwtAuthGuard, RolesGuard } from '@/common/guard/jwt.guard';

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new comment' })
  @ApiCreatedResponse({ description: 'Create success', type: Comment })
  @ApiBadRequestResponse({ description: 'Bad request data' })
  create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: any) {
    return this.commentService.create(createCommentDto, user.id);
  }

  @Get('/comments')
  @ApiOperation({ summary: 'Find all comments' })
  @ApiOkResponse({ type: [Comment] })
  findAllComments() {
    return this.commentService.findAllComments();
  }

  @Get('establishment/:id')
  @ApiOperation({ summary: 'Find comments by establishment' })
  @ApiOkResponse({ type: [Comment] })
  findByEstablishment(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findByEstablishment(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update  comment' })
  @ApiOkResponse({ type: Comment })
  @ApiNotFoundResponse({ description: 'Invalid id' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Delete  comment' })
  @ApiNotFoundResponse({ description: 'Invalid id' })
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
