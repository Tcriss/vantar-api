import { UserFieldsInterceptor } from './user-fields.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

import { userMock, userMock2, userMock3 } from '../../domain/entities/mocks/user.mocks';
import { UserEntity } from 'src/users/domain/entities/user.entity';

describe('UserFieldsInterceptor', () => {
    let interceptor: UserFieldsInterceptor;

    beforeEach(() => {
        interceptor = new UserFieldsInterceptor();
    });

    it('should be defined', () => {
        expect(interceptor).toBeDefined();
    });

    it('should exclude password and refresh_token from a single user object', (done) => {
        const context = {} as ExecutionContext;
        const mockCallHandler: CallHandler = {
          handle: () => of(userMock),
        };

        interceptor.intercept(context, mockCallHandler).subscribe((result) => {
            expect(result).toEqual({
              id: 'a4b1c2d3-4567-890a-bcde-fghij1234567',
              name: 'Alice Smith',
              email: 'alice.smith@example.com',
              active: true,
              role: 'ADMIN',
              created_at: new Date('2024-06-05T10:00:00Z'),
            });
            done();
        });
    });

    it('should exclude password and refresh_token from an array of user objects', (done) => {
        const users: UserEntity[] = [ userMock2, userMock3 ];
        const context = {} as ExecutionContext;
        const mockCallHandler: CallHandler = {
          handle: () => of(users),
        };

        interceptor.intercept(context, mockCallHandler).subscribe((result) => {
            expect(result).toEqual([
                {
                  id: 'b5c2d3e4-5678-901a-bcde-fghij2345678',
                  name: 'Bob Johnson',
                  email: 'bob.johnson@example.com',
                  active: true,
                  role: 'CUSTOMER',
                  created_at: new Date('2024-06-05T10:00:00Z'),
                },
                {
                  id: 'c6d3e4f5-6789-012a-bcde-fghij3456789',
                  name: 'Bob Johnson',
                  email: 'charlie.brown@example.com',
                  active: true,
                  role: 'CUSTOMER',
                  created_at: new Date('2024-06-05T10:00:00Z'),
                },
            ]);
            done();
        });
    });
});
