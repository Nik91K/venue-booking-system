import { PageMetaDto } from '@common/pagination/dto/page-meta.dto';
import {
  PageOptionsDto,
  SortField,
} from '@common/pagination/dto/page-options.dto';
import { PageDto } from '@common/pagination/dto/page.dto';
import { CreateEstablishmentDto } from '@modules/establishment/dto/create-establishment.dto';
import { UpdateEstablishmentDto } from '@modules/establishment/dto/update-establishment.dto';
import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { EstablishmentType } from '@modules/establishment-type/entities/establishment-type.entity';
import { Feature } from '@modules/features/entities/feature.entity';
import { User, UserRole } from '@modules/users/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';

type EstablishmentWithMetrics = Establishment & {
  commentsCount: number;
  avgRating: number;
  weightedRating: number;
};

@Injectable()
export class EstablishmentService {
  private readonly MINIMUM_COMMENTS: number;
  private readonly GLOBAL_AVERAGE_RATING: number;
  private readonly UPLOADS_ESTABLISHMENTS_PATH: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Establishment)
    private establishmentRepository: Repository<Establishment>,
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
    @InjectRepository(EstablishmentType)
    private typeRepository: Repository<EstablishmentType>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    this.MINIMUM_COMMENTS =
      this.configService.getOrThrow<number>('MINIMUM_COMMENTS');
    this.GLOBAL_AVERAGE_RATING = this.configService.getOrThrow<number>(
      'GLOBAL_AVERAGE_RATING'
    );
    this.UPLOADS_ESTABLISHMENTS_PATH = this.configService.getOrThrow<string>(
      'UPLOADS_ESTABLISHMENTS_PATH'
    );
  }

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

  // Query builder to get establishments with their metrics
  private getEstablishmentMetrics(): SelectQueryBuilder<Establishment> {
    return this.establishmentRepository
      .createQueryBuilder('establishment')
      .addSelect('COUNT(comments.id)', 'commentsCount')
      .addSelect('COALESCE(AVG(comments.rating), 0)', 'avgRating')
      .addSelect(
        // If the establishment has no comments, then weightedRating = 0
        // The fewer comments, the stronger the influence of the global rating
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
      .leftJoinAndSelect('establishment.type', 'type')
      .leftJoinAndSelect('establishment.features', 'features')
      .groupBy('establishment.id')
      .addGroupBy('type.id')
      .addGroupBy('features.id');
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<Establishment>,
    pageOptionsDto: PageOptionsDto
  ): void {
    const sortColumn = {
      [SortField.WEIGHTED_RATING]: '"weightedRating"',
      [SortField.COMMENTS_COUNT]: '"commentsCount"',
      [SortField.AVG_RATING]: '"avgRating"',
    };

    const column = sortColumn[pageOptionsDto.sortBy];
    queryBuilder.orderBy(column, pageOptionsDto.order);
    queryBuilder.addOrderBy('establishment.id', 'ASC');
  }

  async getAllEstablishments(
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<EstablishmentWithMetrics>> {
    const queryBuilder = this.getEstablishmentMetrics();

    if (pageOptionsDto.search) {
      queryBuilder.andWhere(
        '(LOWER(establishment.name) LIKE LOWER(:search) OR LOWER(establishment.address) LIKE LOWER(:search) OR CAST(establishment.id AS TEXT) LIKE :search)',
        { search: `%${pageOptionsDto.search}%` }
      );
    }

    this.applySorting(queryBuilder, pageOptionsDto);
    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.take);

    const results = await queryBuilder.getRawAndEntities();

    if (results.entities.length === 0) {
      const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount: 0 });
      return new PageDto([], pageMetaDto);
    }

    const enhancedEstablishments: EstablishmentWithMetrics[] =
      results.entities.map((establishment, index) => {
        const raw = results.raw[index];
        return {
          ...establishment,
          commentsCount: parseInt(raw.commentsCount) || 0,
          avgRating: parseFloat(raw.avgRating) || 0,
          weightedRating: parseFloat(raw.weightedRating) || 0,
        };
      });

    // Use filtered count, not total count
    const itemCount = await queryBuilder
      .clone()
      .offset(undefined)
      .limit(undefined)
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

  async getEstablishmentByOwner(ownerId: number) {
    const establishment = await this.establishmentRepository.find({
      where: { ownerId },
      relations: ['type', 'features', 'comments'],
    });

    if (!establishment.length) {
      throw new NotFoundException(
        `Establishment for owner ${ownerId} not found`
      );
    }

    return establishment;
  }

  async getAllComments(id: number) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${id} not found`);
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
      throw new NotFoundException(`Establishment ${id} not found`);
    }

    if (file) {
      establishment.coverPhoto = `${this.UPLOADS_ESTABLISHMENTS_PATH}/${file.filename}`;
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

    if (result.affected === 0) {
      throw new NotFoundException(`Establishment ${id} not found`);
    }
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
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    if (!user.favorites) {
      user.favorites = [];
    }

    if (!user.favorites.includes(establishmentId)) {
      user.favorites.push(establishmentId);
      await this.userRepository.save(user);
    }

    return user.favorites;
  }

  async removeFavorite(userId: number, establishmentId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    if (!user.favorites) {
      user.favorites = [];
    }

    user.favorites = user.favorites.filter(id => id !== establishmentId);

    await this.userRepository.save(user);
  }

  async getAllFavorites(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    if (!user.favorites || user.favorites.length === 0) {
      return [];
    }

    return this.establishmentRepository.find({
      where: { id: In(user.favorites) },
    });
  }

  async addModerator(
    establishmentId: number,
    userId: number,
    currentUserId: number
  ) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
      relations: ['owner', 'moderators'],
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${establishmentId} not found`);
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
    });

    if (!currentUser) {
      throw new NotFoundException(`Current user ${currentUserId} not found`);
    }

    if (
      currentUser.role !== UserRole.SUPER_ADMIN &&
      establishment.ownerId !== currentUserId
    ) {
      throw new BadRequestException(
        `User ${currentUserId} does not have permission to add moderators`
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    if (user.role !== UserRole.MODERATOR) {
      throw new BadRequestException(`User ${userId} is not a moderator`);
    }

    if (!establishment.moderators) {
      establishment.moderators = [];
    }

    const alreadyModerator = establishment.moderators.some(
      mod => mod.id === userId
    );

    if (alreadyModerator) {
      return establishment;
    }

    establishment.moderators.push(user);
    return await this.establishmentRepository.save(establishment);
  }

  async removeModerator(
    establishmentId: number,
    userId: number,
    currentUserId: number
  ) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
      relations: ['owner', 'moderators'],
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${establishmentId} not found`);
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
    });

    if (!currentUser) {
      throw new NotFoundException(`Current user ${currentUserId} not found`);
    }

    if (
      currentUser.role !== UserRole.SUPER_ADMIN &&
      establishment.ownerId !== currentUserId
    ) {
      throw new BadRequestException(
        `You don't have permission to remove moderators from this establishment`
      );
    }

    establishment.moderators = establishment.moderators.filter(
      mod => mod.id !== userId
    );
    return await this.establishmentRepository.save(establishment);
  }

  async getModerators(establishmentId: number) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
      relations: ['owner', 'moderators'],
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${establishmentId} not found`);
    }

    return establishment.moderators.map(mod => ({
      id: mod.id,
      name: mod.name,
      email: mod.email,
      role: mod.role,
    }));
  }
}
