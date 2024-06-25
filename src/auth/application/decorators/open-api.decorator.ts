import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthEntity } from "src/auth/domain/entities/auth.entity";

export const ApiLogin = () => applyDecorators(
    ApiOperation({ summary: 'Sing in a user' }),
    ApiResponse({ status: HttpStatus.OK, type: AuthEntity }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' }),
    ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Wrong credentials' })
);

export const ApiRefresh = () => applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Refresh user token' }),
    ApiResponse({ status: 200, type: AuthEntity }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Wrong credentials' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
);

export const ApiLogout = () => applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Log out a user' }),
    ApiResponse({ status: HttpStatus.OK, description: 'User logOut successfully' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' }),
    ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Wrong credentials' })
);