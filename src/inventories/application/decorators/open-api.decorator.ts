import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";

import { InventoryEntity } from "../../domain/entities/inventory.entity";

export const ApiGetInventories = () => applyDecorators(
    ApiOperation({ summary: "Get all customer's inventories" }),
    ApiResponse({ status: HttpStatus.OK, type: InventoryEntity, isArray: true }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Page param missing' }),
    ApiQuery({ name: 'page', example: '0, 10', required: true, description: 'Field that let you paginate the data, take 10 (inventories), skip 1 (skip only one inventory)' }),
    ApiQuery({ name: 'fields', required: false, description: 'Fields you want to fetch in your response' }),
    //ApiQuery({ name: 'q', required: false, description: 'Query earch term' })
);

export const ApiGetInventory = () => applyDecorators(
    ApiOperation({ summary: "Get a inventory by id" }),
    ApiResponse({ status: HttpStatus.OK, type: InventoryEntity }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid id' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Inventory not found' }),
    ApiParam({ name: 'id', description: 'Inventory id', format: 'uuid', required: true }),
    ApiQuery({ name: 'fields', required: false, description: 'Fields you want to fetch in your response' }),
);

export const ApiCreateInventory = () => applyDecorators(
    ApiOperation({ summary: 'Create a inventory' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Inventory created succesfully' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' })
);

export const ApiUpdateInventory = () => applyDecorators(
    ApiOperation({ summary: 'Update inventory' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Inventory updated' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Inventory not found' }),
    ApiParam({ name: 'id', description: 'Inventory id', format: 'uuid', required: true })
);

export const ApiDeleteInventory = () => applyDecorators(
    ApiOperation({ summary: 'Delete inventory' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Inventory deleted' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid id' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Inventory not found' }),
    ApiParam({ name: 'id', description: 'Inventory id', format: 'uuid', required: true })
);