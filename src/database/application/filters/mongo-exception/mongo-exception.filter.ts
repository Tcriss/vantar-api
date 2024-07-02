import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class MongoExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
