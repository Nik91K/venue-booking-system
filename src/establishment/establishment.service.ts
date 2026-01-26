import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstablishmentType } from 'src/establishment-type/entities/establishment-type.entity';
import { Feature } from 'src/features/entities/feature.entity';
import { PageMetaDto } from 'src/pagination/dto/page-meta.dto';
import { PageOptionsDto, SortField } from 'src/pagination/dto/page-options.dto';
import { PageDto } from 'src/pagination/dto/page.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { Establishment } from './entities/establishment.entity';

@Injectable()
export class EstablishmentService {
  private readonly MINIMUM_COMMENTS = 2;
  private readonly GLOBAL_AVERAGE_RATING = 1;

  constructor(
    @InjectRepository(Establishment)
    private establishmentRepository: Repository<Establishment>,
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
    @InjectRepository(EstablishmentType)
    private typeRepository: Repository<EstablishmentType>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createEstablishmentDto: CreateEstablishmentDto, userId: number) {
    const establishment = this.establishmentRepository.create(
      createEstablishmentDto
    );

    if (createEstablishmentDto.typeId) {
      const type = await this.typeRepository.findOne({
        where: { id: createEstablishmentDto.typeId },
      });

      if (!type) {
        throw new NotFoundException(
          `EstablishmentType ${createEstablishmentDto.typeId} not found`
        );
      }

      establishment.type = type;
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    establishment.owner = user;

    return this.establishmentRepository.save(establishment);
  }

  async getAllEstablishments(
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<Establishment>> {
    const queryBuilder = this.establishmentRepository
      .createQueryBuilder('establishment')
      .select('establishment.id', 'id')
      .addSelect('COUNT(comments.id)', 'commentsCount')
      .addSelect('COALESCE(AVG(comments.rating), 0)', 'avgRating')
      .addSelect(
        `
        CASE 
          WHEN COUNT(comments.id) = 0 THEN 0
          ELSE (
            (COUNT(comments.id)::float / (COUNT(comments.id) + :m)) * AVG(comments.rating)
            +
            (:m::float / (COUNT(comments.id) + :m)) * :C
          )
        END
      `,
        'weightedRating'
      )
      .leftJoin('establishment.comments', 'comments')
      .setParameter('m', this.MINIMUM_COMMENTS)
      .setParameter('C', this.GLOBAL_AVERAGE_RATING)
      .groupBy('establishment.id');

    if (pageOptionsDto.sortBy == SortField.WEIGHTED_RATING) {
      queryBuilder.orderBy('"weightedRating"', pageOptionsDto.order);
    } else if (pageOptionsDto.sortBy === SortField.COMMENTS_COUNT) {
      queryBuilder.orderBy('"commentsCount"', pageOptionsDto.order);
    } else if (pageOptionsDto.sortBy === SortField.AVG_RATING) {
      queryBuilder.orderBy('"avgRating"', pageOptionsDto.order);
    } else {
      queryBuilder.orderBy('establishment.id', pageOptionsDto.order);
    }

    queryBuilder
      .addOrderBy('establishment.id', 'ASC')
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.take);

    const sortedResults = await queryBuilder.getRawMany();

    if (sortedResults.length === 0) {
      const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount: 0 });
      return new PageDto([], pageMetaDto);
    }

    const establishmentIds = sortedResults.map(result => result.id);
    const metricsMap = new Map(
      sortedResults.map(result => [
        result.id,
        {
          commentsCount: parseInt(result.commentsCount) || 0,
          avgRating: parseFloat(result.avgRating) || 0,
          weightedRating: parseFloat(result.weightedRating) || 0,
        },
      ])
    );

    const establishments = await this.establishmentRepository
      .createQueryBuilder('establishment')
      .leftJoinAndSelect('establishment.type', 'type')
      .leftJoinAndSelect('establishment.features', 'features')
      .leftJoinAndSelect('establishment.comments', 'comments')
      .whereInIds(establishmentIds)
      .getMany();

    const orderedEstablishments = establishmentIds
      .map(id => establishments.find(e => e.id === id))
      .filter(e => e !== undefined);

    const enhancedEstablishments = orderedEstablishments.map(establishment => ({
      ...establishment,
      ...metricsMap.get(establishment.id),
    }));

    const itemCount = await this.establishmentRepository
      .createQueryBuilder('establishment')
      .getCount();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(enhancedEstablishments, pageMetaDto);
  }

  async getEstablishmentById(id: number): Promise<Establishment> {
    const establishment = await this.establishmentRepository.findOne({
      where: { id },
      relations: ['type', 'features', 'comments'],
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${id} not found`);
    }

    return establishment;
  }

  async getAllComments(id: number) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${id} invalid`);
    }

    return establishment.comments;
  }

  async edit(
    id: number,
    updateEstablishmentDto: UpdateEstablishmentDto,
    file?: Express.Multer.File
  ) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id },
      relations: ['features'],
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${id} invalid`);
    }

    if (file) {
      establishment.coverPhoto = `/uploads/establishments/${file.filename}`;
    }

    this.establishmentRepository.merge(establishment, updateEstablishmentDto);
    return this.establishmentRepository.save(establishment);
  }

  async findOneWithFeatures(id: number) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id },
      relations: ['features', 'comments'],
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${id} not found`);
    }

    return establishment;
  }

  async remove(id: number) {
    const result = await this.establishmentRepository.delete(id);
    return result;
  }

  async addFeature(establishmentId: number, featureId: number) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
      relations: ['features'],
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${establishmentId} not found`);
    }

    const feature = await this.featureRepository.findOne({
      where: { id: featureId },
    });

    if (!feature) {
      throw new NotFoundException(`Feature ${featureId} not found`);
    }

    const featureExists = establishment.features.some(f => f.id === featureId);

    if (featureExists) {
      throw new BadRequestException(
        'Feature already added to this establishment'
      );
    }

    establishment.features.push(feature);
    return await this.establishmentRepository.save(establishment);
  }

  async removeFeature(establishmentId: number, featureId: number) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
      relations: ['features'],
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${establishmentId} not found`);
    }

    const initialLength = establishment.features.length;
    establishment.features = establishment.features.filter(
      f => f.id !== featureId
    );

    if (establishment.features.length === initialLength) {
      throw new NotFoundException(
        `Feature ${featureId} not found in this establishment`
      );
    }

    return await this.establishmentRepository.save(establishment);
  }

  async addFavorite(userId: number, establishmentId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    if (!user.favorites.includes(establishmentId)) {
      user.favorites.push(establishmentId);
      await this.userRepository.save(user);
    }

    return user.favorites;
  }

  async removeFavorite(userId: number, establishmentId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    user.favorites = user.favorites.filter(id => id !== establishmentId);

    await this.userRepository.save(user);
  }
}
