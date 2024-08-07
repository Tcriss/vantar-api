import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  private readonly logger = new Logger();

  constructor(private config: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    const { url, method, ip } = req;
    const userAgent: string = req.get('user-agent' || '');

    res.on('finish', (): void => {
      const { statusCode } = res;
      const contentLength = res.get('content-length' || '');

      if (this.config.get('NODE_ENV') === 'development') this.logger.warn(`${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`)
    });

    next();
  }
}
