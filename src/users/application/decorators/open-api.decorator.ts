import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

import { UserEntity } from '@users/domain/entities';

export const ApiGetUsers = () => applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get users' }),
    ApiResponse({ type: UserEntity, isArray: true }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Credentials missing' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Server error' }),
    ApiQuery({ name: 'page', required: true, example: 1, description: 'The page of results you want to fetch' }),
    ApiQuery({ name: 'limit', required: true, example: 10, description: 'How many users will be fetch per page' }),
    ApiQuery({ name: 'q', required: false, description: 'search param to filter results' })
);

export const ApiGetUser = () => applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get a user' }),
    ApiResponse({ type: UserEntity }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Server error' }),
    ApiParam({ name: 'id', description: 'User id', format: 'uuid', required: true })
);

export const ApiCreateUser = () => applyDecorators(
    ApiOperation({ summary: 'Create user' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'User created succesfully' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'User already exist or you are already logged, method not allowed' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
);

export const ApiUpdateUser = () => applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update user' }),
    ApiResponse({ status: HttpStatus.OK, description: 'User created succesfully' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' }),
    ApiParam({ name: 'id', description: 'User id', format: 'uuid', required: true })
);

export const ApiDeleteUser = () => applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete user' }),
    ApiResponse({ status: HttpStatus.OK, description: 'User deleted succesfully' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' }),
    ApiParam({ name: 'id', description: 'User id', format: 'uuid', required: true })
);