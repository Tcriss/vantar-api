import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { Response } from 'express';

@Catch(JsonWebTokenError)
export class JwtExceptionsFilter implements ExceptionFilter {

  catch(exception: JsonWebTokenError, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();

    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid token signature',
      cause: 'This token is not a refresh token'
    });
  }
}
