import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { InvoiceEntity } from '@invoices/domain/entities';
import { InvoiceQueries } from '@invoices/domain/types';
import { CreateInvoiceDto, UpdateInvoiceDto } from '@invoices/domain/dtos';
import { InvoiceService } from '@invoices/application/services';
import { ApiCreateInvoice, ApiDeleteInvoice, ApiGetInvoice, ApiGetInvoices, ApiUpdateInvoice } from '@invoices/application/decorators';
import { OwnerGuard, RoleGuard } from '@auth/application/guards';
import { Roles } from '@common/domain/enums';
import { Role } from '@common/application/decorators';

@ApiBearerAuth()
@ApiTags('Invoices')
@Role(Roles.CUSTOMER)
@UseGuards(RoleGuard)
@Controller('invoices')
export class InvoiceController {

    constructor(private readonly service: InvoiceService) {}

    @ApiGetInvoices()
    @UseGuards(OwnerGuard)
    @Get()
    public async findAll(@Query() queries: InvoiceQueries): Promise<Partial<InvoiceEntity>[]> {
        if (!queries.limit || !queries.page) throw new HttpException("'page' or 'limit' param missing", HttpStatus.BAD_REQUEST);

        const { page, limit, fields, shop } = queries;

        return this.service.findAllInvoices(
            shop,
            { 
                skip: (page - 1) * limit,
                take: limit
            },
            fields
        );
    }

    @ApiGetInvoice()
    @UseGuards(OwnerGuard)
    @Get(':id')
    public async findOne(@Param('id', new ParseUUIDPipe()) id: string, @Query('fields') fields?: string): Promise<Partial<InvoiceEntity>> {
        const res = await this.service.findOneInvoice(id);

        if (!res) throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);

        return res;
    }

    @ApiCreateInvoice()
    @Post()
    public async create(@Body() invoice: CreateInvoiceDto): Promise<unknown> {
        const res = await this.service.createInvoice(invoice);

        if (res == null) throw new HttpException('Products from invoice not created', HttpStatus.BAD_REQUEST);

        return {
            message: 'Invoice created successfully',
            invoice: res
        };
    }

    @ApiUpdateInvoice()
    @UseGuards(OwnerGuard)
    @Patch(':id')
    public async update(@Body() invoice: UpdateInvoiceDto, @Param('id', new ParseUUIDPipe()) id: string): Promise<unknown> {
        const res = await this.service.updateInvoice(id, invoice);

        if (!res) throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Invoice updated successfully',
            invoice: res
        };
    }

    @ApiDeleteInvoice()
    @UseGuards(OwnerGuard)
    @Delete(':id')
    public async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<unknown> {
        const res = await this.service.deleteInvoice(id);

        if (!res) throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);

        return { message: 'Invoice deleted' };
    }
}
