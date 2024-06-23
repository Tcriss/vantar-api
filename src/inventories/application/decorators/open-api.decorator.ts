import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { InventoryEntity } from "src/inventory/domain/entities/inventory.entity";

export const ApiGetInventories = () => applyDecorators(
    ApiOperation({ summary: "Get all customer's inventories" }),
    ApiResponse({ status: 200, type: InventoryEntity, isArray: true }),
    ApiResponse({ status: 400, description: 'Page param missing' }),
    ApiQuery({ name: 'page', required: true }),
    ApiQuery({ name: 'fields', required: false, description: 'Fields you want to fetch in your response' }),
    ApiQuery({ name: 'q', required: false, description: 'Query earch term' })
);

export const ApiGetInventory = () => applyDecorators(
    ApiOperation({ summary: "Get a inventory by id" }),
    ApiResponse({ status: 200, type: InventoryEntity }),
    ApiResponse({ status: 400, description: 'Invalid id' }),
    ApiResponse({ status: 404, description: 'Inventory not found' }),
    ApiQuery({ name: 'fields', required: false, description: 'Fields you want to fetch in your response' }),
);

export const ApiCreateInventory = () => applyDecorators(
    ApiOperation({ summary: 'Create a inventory' }),
    ApiResponse({ status: 201, description: 'Inventory created succesfully' }),
    ApiResponse({ status: 400, description: 'Validations error' })
);

export const ApiUpdateInventory = () => applyDecorators(
    ApiOperation({ summary: 'Update inventory' }),
    ApiResponse({ status: 200, description: 'Inventory updated' }),
    ApiResponse({ status: 400, description: 'Validations error' }),
    ApiResponse({ status: 404, description: 'Inventory not found' })
);

export const ApiDeleteInventory = () => applyDecorators(
    ApiOperation({ summary: 'Delete inventory' }),
    ApiResponse({ status: 200, description: 'Inventory deleted' }),
    ApiResponse({ status: 400, description: 'Invalid id' }),
    ApiResponse({ status: 404, description: 'Inventory not found' })
);