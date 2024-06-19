import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthEntity } from "src/auth/domain/entities/auth.entity";

export const ApiLogin = () => applyDecorators(
    ApiOperation({ summary: 'Sing in a user' }),
    ApiResponse({ status: 200, type: AuthEntity }),
    ApiResponse({ status: 404, description: 'User not found' }),
    ApiResponse({ status: 406, description: 'Wrong credentials' })
);

export const ApiRefresh = () => applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Refresh user token' }),
    ApiResponse({ status: 200, type: AuthEntity }),
    ApiResponse({ status: 401, description: 'Wrong credentials' }),
    ApiResponse({ status: 404, description: 'User not found' })
);

export const ApiLogout = () => applyDecorators(
    ApiOperation({ summary: 'Log out a user' }),
    ApiResponse({ status: 200, description: 'User logOut successfully' }),
    ApiResponse({ status: 404, description: 'User not found' }),
    ApiResponse({ status: 406, description: 'Wrong credentials' })
);