import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";

import { ShopEntity } from "@shops/domain/entities";

export const ApiGetShops = () => applyDecorators(
    ApiOperation({ summary: "Get all customer's shops" }),
    ApiResponse({ status: HttpStatus.OK, type: ShopEntity, isArray: true }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Page param missing' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiQuery({ name: 'page', required: true, example: 1, description: 'The page of result you eant to fetch' }),
    ApiQuery({ name: 'limit', required: true, example: 10, description: 'How many inventories will be fetch per page' }),
    ApiQuery({ name: 'fields', required: false, description: 'Fields you want to fetch in your response' })
);

export const ApiGetShop = () => applyDecorators(
    ApiOperation({ summary: "Get a shop by id" }),
    ApiResponse({ status: HttpStatus.OK, type: ShopEntity }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid id' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Shop not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiParam({ name: 'id', description: 'Inventory id', format: 'uuid', required: true }),
    ApiQuery({ name: 'fields', required: false, description: 'Fields you want to fetch in your response' }),
);

export const ApiCreateShop = () => applyDecorators(
    ApiOperation({ summary: 'Create a shop' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Shop created succesfully' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' })
);

export const ApiUpdateShop = () => applyDecorators(
    ApiOperation({ summary: 'Update shop' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Shop updated' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Shop not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiParam({ name: 'id', description: 'Inventory id', format: 'uuid', required: true })
);

export const ApiDeleteShop = () => applyDecorators(
    ApiOperation({ summary: 'Delete shop' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Shop deleted' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid id' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Shop not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiParam({ name: 'id', description: 'Inventory id', format: 'uuid', required: true })
);