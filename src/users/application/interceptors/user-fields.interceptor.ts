import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class UserFieldsInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: UserEntity | UserEntity[]) => (this.excludeSensitiveFields(data))),
    );
  }

  private excludeSensitiveFields(data: UserEntity | UserEntity[]): Partial<UserEntity> | Partial<UserEntity>[] {
    if (data instanceof Array) {
      return data.map(user => {
        const {
          password,
          refresh_token,
          activation_token,
          reset_token,
          ...rest
        } = user;
  
        return rest;
      })
    } else {
      const {
        password,
        refresh_token,
        activation_token,
        reset_token,
        ...rest
      } = data;

      return rest;
    }
  }
}
