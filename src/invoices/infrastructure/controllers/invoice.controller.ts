import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { InvoiceQueries } from '../../domain/types';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../../domain/dtos';
import { InvoiceService } from '../../application/services/invoice.service';
import { RoleGuard } from '../../../auth/application/guards/role/role.guard';
import { ApiCreateInvoice, ApiDeleteInvoice, ApiGetInvoice, ApiGetInvoices, ApiUpdateInvoice } from '../../application/decorators';
import { Roles } from '../../../common/domain/enums';
import { Role } from '../../../common/application/decorators';

@ApiBearerAuth()
@ApiTags('Invoices')
@Role(Roles.CUSTOMER)
@UseGuards(RoleGuard)
@Controller('invoices')
export class InvoiceController {

    constructor(private readonly service: InvoiceService) {}

    @ApiGetInvoices()
    @Get()
    public async findAll(@Req() req: Request, @Query() queries: InvoiceQueries): Promise<Partial<InvoiceEntity>[]> {
        if (!queries.limit || !queries.page) throw new HttpException("'page' or 'limit' param missing", HttpStatus.BAD_REQUEST);

        const { page, limit, fields } = queries;

        return this.service.findAllInvoices(req['user']['id'], { take: (page - 1) * limit, skip: limit }, fields);
    }

    @ApiGetInvoice()
    @Get(':id')
    public async findOne(
        @Req() req: Request,
        @Param('id', new ParseUUIDPipe()) id: string,
        @Query('fields') fields?: string
    ): Promise<Partial<InvoiceEntity>> {
        const res = await this.service.findOneInvoice(id, req['user']['id']);

        if (!res) throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);

        return res;
    }

    @ApiCreateInvoice()
    @Post()
    public async create(@Req() req: Request, @Body() invoice: CreateInvoiceDto): Promise<unknown> {
        const res = await this.service.createInvoice(req['user']['id'], invoice);

        if (res == null) throw new HttpException('Products from invoice not created', HttpStatus.BAD_REQUEST);

        return {
            message: 'Invoice created successfully',
            invoice: res
        };
    }

    @ApiUpdateInvoice()
    @Patch(':id')
    public async update(
        @Req() req: Request,
        @Body() invoice: UpdateInvoiceDto,
        @Param('id', new ParseUUIDPipe()) id: string
    ): Promise<unknown> {
        const res = await this.service.updateInvoice(id, req['user']['id'], invoice);

        if (!res) throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Invoice updated successfully',
            invoice: res
        };
    }

    @ApiDeleteInvoice()
    @Delete(':id')
    public async delete(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string): Promise<unknown> {
        const res = await this.service.deleteInvoice(id, req['user']['id']);

        if (!res) throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);

        return { message: 'Invoice deleted' };
    }
}
