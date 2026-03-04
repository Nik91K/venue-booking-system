import { JwtAuthGuard } from '@common/guard/jwt-auth.guard';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  // Override handleRequest so it never throws an error
  handleRequest(err, user, info, context) {
    return user;
  }
}
