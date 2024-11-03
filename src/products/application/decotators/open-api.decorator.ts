import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";

import { ProductEntity } from "@products/domain/entities";
import { CreateProductDto } from "@products/domain/dtos";

export const ApiGetProducts = () => applyDecorators(
    ApiOperation({ summary: 'Get all products' }),
    ApiResponse({ status: HttpStatus.OK, type: ProductEntity, isArray: true }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'page param missing' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Not enough permissions' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiQuery({ name: 'page', required: true, example: 1, description: 'The page of result you want to fetch' }),
    ApiQuery({ name: 'limit', required: true, example: 10, description: 'How many products will be fetch per page' }),
    ApiQuery({ name: 'shop', required: true, description: 'shop id param to verify you have access to the products' }),
    ApiQuery({ name: 'q', required: false, description: 'search param to filter results' }),
    ApiQuery({ name: 'selected', required: false, description: 'fields you want to select from response' })
);

export const ApiGetProduct = () => applyDecorators(
    ApiOperation({ summary: 'Get one product' }),
    ApiResponse({ status: HttpStatus.OK, type: ProductEntity }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid id' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Not enough permissions' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiParam({ name: 'id', description: 'Product id', format: 'uuid', required: true }),
    ApiQuery({ name: 'shop', required: true, description: 'shop id param to verify you have access to the product' }),
    ApiQuery({ name: 'fields', required: false, description: 'fields you want to select from response' })
);

export const ApiCreateProducts = () => applyDecorators(
    ApiOperation({ summary: 'Create many products' }),
    ApiBody({ type: CreateProductDto, isArray: true }),
    ApiResponse({ status: HttpStatus.OK, description: 'Product created succesfully', type: ProductEntity, isArray: true }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' })
);

export const ApiCreateProduct = () => applyDecorators(
    ApiOperation({ summary: 'Create one product' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Product created succesfully', type: ProductEntity, }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
);

export const ApiUpdateProduct = () => applyDecorators(
    ApiOperation({ summary: 'Update product' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Product updated succesfully', type: ProductEntity }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Not enough permissions' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiParam({ name: 'id', description: 'Product id', format: 'uuid', required: true }),
    ApiQuery({ name: 'shop', required: true, description: 'shop id param to verify you have permissions' })
);

export const ApiDeleteProduct = () => applyDecorators(
    ApiOperation({ summary: 'Delete product' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Product deleted succesfully' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Id invalid' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Not enough permissions' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiParam({ name: 'id', description: 'Product id', format: 'uuid', required: true }),
    ApiQuery({ name: 'shop', required: true, description: 'shop id param to verify you have permissions' })
);