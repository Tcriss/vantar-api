import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

import { AuthEntity } from "@auth/domain/entities/auth.entity";

export const ApiLogin = () => applyDecorators(
    ApiOperation({ summary: 'Sing in a user' }),
    ApiResponse({ status: HttpStatus.OK, type: AuthEntity }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' }),
    ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Wrong credentials' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
);

export const ApiRefresh = () => applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Refresh user access token to keep session' }),
    ApiResponse({ status: HttpStatus.OK, type: AuthEntity }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found' }),
    ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Invalid token' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
);

export const ApiLogout = () => applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Log out a user' }),
    ApiResponse({ status: HttpStatus.OK, description: 'User logOut successfully' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' }),
    ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Wrong credentials' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'User could not logout' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' })
);

export const ApiForgotPassword = () => applyDecorators(
    ApiOperation({ summary: 'Request a password change if user forgot it' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Reset request sent through email' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
);

export const ApiActivateAccount = () => applyDecorators(
    ApiOperation({ summary: 'Activate user account' }),
    ApiResponse({ status: HttpStatus.OK, description: 'User account activated successfully' }),
    ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Invalid token' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'User could not logout' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiQuery({ name: 'token', required: true, description: 'Activation token sent though e-mail' })
);

export const ApiResetPassword = () => applyDecorators(
    ApiOperation({ summary: 'Resets user password' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Password reset' }),
    ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Invalid token' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiQuery({ name: 'token', required: true, description: 'The reset token sent through email' })
);