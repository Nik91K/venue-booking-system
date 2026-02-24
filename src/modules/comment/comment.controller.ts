import { Roles } from '@common/decorator/roles.decorator';
import { CurrentUser } from '@common/decorator/user.decorator';
import { JwtAuthGuard, RolesGuard } from '@common/guard/jwt.guard';
import { PageOptionsDto } from '@common/pagination/dto/page-options.dto';
import { PageDto } from '@common/pagination/dto/page.dto';
import { CommentService } from '@modules/comment/comment.service';
import { CreateCommentDto } from '@modules/comment/dto/create-comment.dto';
import { UpdateCommentDto } from '@modules/comment/dto/update-comment.dto';
import { Comment } from '@modules/comment/entities/comment.entity';
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
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new comment' })
  @ApiCreatedResponse({ description: 'Create success', type: Comment })
  @ApiBadRequestResponse({ description: 'Bad request data' })
  create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: any) {
    return this.commentService.create(createCommentDto, user.id);
  }

  @Get('/comments')
  @ApiOperation({ summary: 'Find all comments' })
  @ApiOkResponse({ type: PageDto })
  findAllComments(
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<Comment>> {
    return this.commentService.findAllComments(pageOptionsDto);
  }

  @Get('establishment/:id')
  @ApiOperation({ summary: 'Find comments by establishment' })
  @ApiOkResponse({ type: PageDto })
  findByEstablishment(
    @Param('id', ParseIntPipe) id: number,
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<Comment>> {
    return this.commentService.findByEstablishment(id, pageOptionsDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update comment' })
  @ApiOkResponse({ type: Comment })
  @ApiNotFoundResponse({ description: 'Invalid id' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Delete  comment' })
  @ApiNotFoundResponse({ description: 'Invalid id' })
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
