import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerConfig: ThrottlerModuleOptions = [
  {
    name: 'default',
    ttl: 60000,
    limit: 100,
  },
  {
    name: 'auth',
    ttl: 60000,
    limit: 5,
  },
  {
    name: 'booking',
    ttl: 60000,
    limit: 20,
  },
];
