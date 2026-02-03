import { AuthModule } from '@modules/auth/auth.module';
import { CommentController } from '@modules/comment/comment.controller';
import { CommentService } from '@modules/comment/comment.service';
import { Comment } from '@modules/comment/entities/comment.entity';
import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { EstablishmentModule } from '@modules/establishment/establishment.module';
import { User } from '@modules/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Establishment, User]),
    EstablishmentModule,
    AuthModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
