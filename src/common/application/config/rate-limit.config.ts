import { ConfigService } from '@nestjs/config';

export const rateLimitConfig = (config: ConfigService) => ({
  throttlers: [
    {
      ttl: config.get<number>('THR_TIME') ?? 60000,
      limit: config.get<number>('THR_LIMIT') ?? 60,
    },
  ],
  errorMessage: 'Too many requests',
});