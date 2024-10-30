import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";

import { InventoryEntity } from "../../domain/entities/inventory.entity";

export const ApiGetInventories = () => applyDecorators(
    ApiOperation({ summary: "Get all customer's inventories" }),
    ApiResponse({ status: HttpStatus.OK, type: InventoryEntity, isArray: true }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Page param missing' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiQuery({ name: 'page', required: true, example: 1, description: 'The page of result you eant to fetch' }),
    ApiQuery({ name: 'limit', required: true, example: 10, description: 'How many inventories will be fetch per page' }),
    ApiQuery({ name: 'fields', required: false, description: 'Fields you want to fetch in your response' }),
    //ApiQuery({ name: 'q', required: false, description: 'Query earch term' })
);

export const ApiGetInventory = () => applyDecorators(
    ApiOperation({ summary: "Get a inventory by id" }),
    ApiResponse({ status: HttpStatus.OK, type: InventoryEntity }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid id' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Inventory not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiParam({ name: 'id', description: 'Inventory id', format: 'uuid', required: true }),
    ApiQuery({ name: 'fields', required: false, description: 'Fields you want to fetch in your response' }),
);

export const ApiCreateInventory = () => applyDecorators(
    ApiOperation({ summary: 'Create a inventory' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Inventory created succesfully' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' })
);

export const ApiUpdateInventory = () => applyDecorators(
    ApiOperation({ summary: 'Update inventory' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Inventory updated' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Inventory not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiParam({ name: 'id', description: 'Inventory id', format: 'uuid', required: true })
);

export const ApiDeleteInventory = () => applyDecorators(
    ApiOperation({ summary: 'Delete inventory' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Inventory deleted' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid id' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Inventory not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiParam({ name: 'id', description: 'Inventory id', format: 'uuid', required: true })
);