import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtAuthGuard, RolesGuard } from 'src/auth/jwt.guard';

@ApiTags("Comments")
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({summary: 'Create new comment'})
  @ApiCreatedResponse({ description: "Create success", type: Comment})
  @ApiBadRequestResponse({ description: "Bad request data"})
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto)
  }

  @Get()
  @ApiOperation({summary: 'Find all comments'})
  @ApiOkResponse({ type: [Comment]})
  findAll() {
    return this.commentService.findByEstablishment()
  }

  @Patch(':id')
  @ApiOperation({summary: 'Update  comment'})
  @ApiOkResponse({ type: Comment})
  @ApiNotFoundResponse({description:'Invalid id'})
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUBER_ADMIN, UserRole.OWNER, UserRole.MODERATOR)
  @ApiOperation({summary: 'Delete  comment'})
  @ApiNotFoundResponse({description:'Invalid id'})
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id)
  }

}
