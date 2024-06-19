import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

import { ProductEntity } from "../../domain/entities/product.entity";

export const ApiGetProducts = () => applyDecorators(
    ApiOperation({ summary: 'Get all products' }),
    ApiResponse({ status: 200, type: ProductEntity, isArray: true }),
    ApiResponse({ status: 400, description: 'page param missing' }),
    ApiQuery({ name: 'page', required: true, example: '0, 10' }),
    ApiQuery({ name: 'q', required: false, description: 'search param to filter results' }),
    ApiQuery({ name: 'selected', required: false, description: 'fields you want to select from response' })
);

export const ApiGetProduct = () => applyDecorators(
    ApiOperation({ summary: 'Get one product' }),
    ApiResponse({ status: 200, type: ProductEntity }),
    ApiResponse({ status: 400, description: 'Invalid id' }),
    ApiResponse({ status: 404, description: 'Product not found' })
);

export const ApiCreateProduct = () => applyDecorators(
    ApiOperation({ summary: 'Create product' }),
    ApiResponse({ status: 200, description: 'Product created succesfully', type: ProductEntity, }),
    ApiResponse({ status: 400, description: 'Validations error' }),
    ApiResponse({ status: 404, description: 'Product not found' })
);

export const ApiUpdateProduct = () => applyDecorators(
    ApiOperation({ summary: 'Update product' }),
    ApiResponse({ status: 200, description: 'Product updated succesfully', type: ProductEntity }),
    ApiResponse({ status: 400, description: 'Validations error' }),
    ApiResponse({ status: 404, description: 'Product not found' })
);

export const ApiDeleteProduct = () => applyDecorators(
    ApiOperation({ summary: 'Delete product' }),
    ApiResponse({ status: 200, description: 'Product deleted succesfully' }),
    ApiResponse({ status: 400, description: 'Id invalid' }),
    ApiResponse({ status: 404, description: 'Product not found' })
);