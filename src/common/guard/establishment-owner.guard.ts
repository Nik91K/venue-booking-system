import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { UserRole } from '@modules/users/entities/user.entity';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EstablishmentOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Establishment)
    private establishmentRepository: Repository<Establishment>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const establishmentId = parseInt(request.params.id);

    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${establishmentId} not found`);
    }

    if (establishment.ownerId !== user.id) {
      throw new ForbiddenException('You do not own this establishment');
    }

    return true;
  }
}
