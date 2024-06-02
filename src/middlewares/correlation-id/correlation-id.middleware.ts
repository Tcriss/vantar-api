import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Response } from 'express';

export const CORRELATION_ID_HEADER: string = 'X-Correlation-Id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const id: string = randomUUID();

    req[CORRELATION_ID_HEADER] = id;
    res.set(CORRELATION_ID_HEADER, id);
    next();
  }
}
