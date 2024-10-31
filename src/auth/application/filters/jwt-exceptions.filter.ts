import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { Response } from 'express';

@Catch(JsonWebTokenError)
export class JwtExceptionsFilter implements ExceptionFilter {

  catch(exception: JsonWebTokenError, host: ArgumentsHost): void {
    const res: Response = host.switchToHttp().getResponse();
    
    switch (exception.name) {
      case 'TokenExpiredError':
        res.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid token',
          cause: 'Session expired'
        });

        break;
      case 'JsonWebTokenError':
        res.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: exception.message
        });
        
        break;
    };
  }
}
