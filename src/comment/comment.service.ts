import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Establishment } from 'src/establishment/entities/establishment.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentService {
  constructor (
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Establishment)
    private establishmentRepository: Repository<Establishment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const { establishmentId, ...data } = createCommentDto;
    
    const establishment = await this.establishmentRepository.findOneBy({ id: establishmentId })

    if (!establishment) {
      throw new NotFoundException(`Establishment ${establishmentId} not found`);
    }

    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const comment = this.commentRepository.create({
      ...data,
      establishment,
      user
    })

    return this.commentRepository.save(comment)
  }

  async findAllComments() {
    return await this.commentRepository.find({})
  }

  async findByEstablishment(establishmentId: number) {
    return this.commentRepository.find({
      where: {
        establishment: { id: establishmentId }
      },
    })
  }

  async update(id: number, updateCreateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOneBy({id});

    if(!comment)
      throw new NotFoundException(`Comment ${id} invalid`)

    this.commentRepository.merge(comment, updateCreateCommentDto)
    return this.commentRepository.save(comment)
  }

  async remove(id: number) {
    const result = await this.commentRepository.delete(id)
    return result
  }

}
