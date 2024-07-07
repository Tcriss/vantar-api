import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  private readonly logger = new Logger();

  constructor() {}

  use(req: Request, res: Response, next: () => void) {
    const { url, method, ip } = req;
    const userAgent: string = req.get('user-agent' || '');

    res.on('finish', (): void => {
      const { statusCode } = res;
      const contentLength = res.get('content-length' || '');

      if (statusCode >= 400) {
        this.logger.error(`${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
      } else {
        this.logger.log(`${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
      }
    });

    next();
  }
}
