import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";

import { InvoiceEntity } from "../../domain/entities/invoice.entity";

export const ApiGetInvoices = () => applyDecorators(
    ApiOperation({ summary: 'Get all invoices' }),
    ApiResponse({ status: HttpStatus.OK, type: InvoiceEntity, isArray: true }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'page param missing' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiQuery({ name: 'page', required: true, example: '0, 10', description: 'how many invoices you want to fetch' }),
    ApiQuery({ name: 'fields', required: false, description: 'fields you want to select from response' })
);

export const ApiGetInvoice = () => applyDecorators(
    ApiOperation({ summary: 'Get one invoice' }),
    ApiResponse({ status: HttpStatus.OK, type: InvoiceEntity }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid id' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Not enough permissions' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiParam({ name: 'id', description: 'Invoice id', format: 'uuid', required: true }),
    ApiQuery({ name: 'fields', required: false, description: 'fields you want to select from response' })
);

export const ApiCreateInvoice = () => applyDecorators(
    ApiOperation({ summary: 'Create one invoice' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'Invoice created succesfully', type: InvoiceEntity, }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
);

export const ApiUpdateInvoice = () => applyDecorators(
    ApiOperation({ summary: 'Update invoice' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Invoice updated succesfully', type: InvoiceEntity }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validations error' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiParam({ name: 'id', description: 'Invoice id', format: 'uuid', required: true })
);

export const ApiDeleteInvoice = () => applyDecorators(
    ApiOperation({ summary: 'Delete invoice' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Invoice deleted succesfully' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid id' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized' }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found' }),
    ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Too many resquest' }),
    ApiParam({ name: 'id', description: 'Invoice id', format: 'uuid', required: true })
);