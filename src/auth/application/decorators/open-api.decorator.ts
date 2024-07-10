import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

import { AuthEntity } from "../../domain/entities/auth.entity";

export const ApiLogin = () => applyDecorators(
    ApiOperation({ summary: 'Sing in a user' }),
    ApiResponse({ status: HttpStatus.OK, type: AuthEntity }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' }),
    ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Wrong credentials' })
);

export const ApiRefresh = () => applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Refresh user access token to keep session' }),
    ApiResponse({ status: HttpStatus.OK, type: AuthEntity }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found' }),
    ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Invalid token' })
);

export const ApiLogout = () => applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Log out a user' }),
    ApiResponse({ status: HttpStatus.OK, description: 'User logOut successfully' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' }),
    ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Wrong credentials' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'User could not logout' })
);

export const ApiActivateAccount = () => applyDecorators(
    ApiOperation({ summary: 'Activate user account' }),
    ApiResponse({ status: HttpStatus.OK, description: 'User account activated successfully' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' }),
    ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Invalid token' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'User could not logout' }),
    ApiQuery({ name: 'token', required: true, description: 'Activation token sent though e-mail' })
);