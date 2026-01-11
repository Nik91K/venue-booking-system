import { Injectable, NotFoundException } from '@nestjs/common';
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

  private async updateEstablishmentRating (establishmentId: number) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
      relations: ['comments']
    })

    if (!establishment) {
      throw new NotFoundException(`Establishment ${establishmentId} not found`);
    }

    const comments = establishment.comments

    if (comments.length == 0) {
      establishment.rating = 0;
    } else {
      const commentRatingSum = comments.reduce((accumulator, comment) => accumulator + comment.rating, 0)
      establishment.rating = parseFloat((commentRatingSum / comments.length).toFixed(2))
    }
    
    await this.establishmentRepository.save(establishment)
    return establishment.rating
  }

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

    const savedComment = await this.commentRepository.save(comment)
    await this.updateEstablishmentRating(establishmentId)
    return savedComment
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
   const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['establishment'],
    })

    if(!comment)
      throw new NotFoundException(`Comment ${id} invalid`)

    this.commentRepository.merge(comment, updateCreateCommentDto)
    const savedComment = await this.commentRepository.save(comment)

    await this.updateEstablishmentRating(comment.establishment.id)
    return savedComment
  }

  async remove(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['establishment'],
    });

    if (!comment) throw new NotFoundException(`Comment ${id} not found`);

    const establishmentId = comment.establishment.id;
    await this.commentRepository.delete(id);

    await this.updateEstablishmentRating(establishmentId);

    return { deleted: true };
  }

}
