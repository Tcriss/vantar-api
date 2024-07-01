import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { InvoiceService } from '../../application/services/invoice.service';
import { RoleGuard } from '../../../auth/application/guards/role/role.guard';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { ReqUser } from '../../../common/domain/types';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../dtos';

@ApiBearerAuth()
@ApiTags('Invoices')
@UseGuards(RoleGuard)
@Controller('invoices')
export class InvoiceController {

    constructor(private service: InvoiceService) {}

    @Get()
    public async findAll(@Req() req: ReqUser, @Query() queries: {page: string, fields?: string}): Promise<Partial<InvoiceEntity>[]> {
        if (!queries.page) throw new HttpException('page query param is missing', HttpStatus.BAD_REQUEST);

        return this.service.findAllInvoices(req.user.id, queries.page, queries.fields);
    }

    @Get(':id')
    public async findOne(
        @Req() req: ReqUser,
        @Param('id', new ParseUUIDPipe()) id: string,
        @Query('fields') fields?: string
    ): Promise<Partial<InvoiceEntity>> {
        const res = await this.service.findOneInvoice(id, req.user.id, fields);

        if (res === undefined) throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
        if (res === null) throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);

        return res;
    }

    @Post()
    public async create(@Req() req: ReqUser, @Body() invoice: CreateInvoiceDto): Promise<unknown> {
        const res = await this.service.createInvoice(req['user']['id'], invoice);

        return {
            message: 'Invoice created successfully',
            invoice: res
        };
    }

    @Patch(':id')
    public async update(
        @Req() req: ReqUser,
        @Body() invoice: UpdateInvoiceDto,
        @Param('id', new ParseUUIDPipe()) id: string
    ): Promise<unknown> {
        const res = await this.service.updateInvoice(id, req['user']['id'], invoice);

        if (res === undefined) throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
        if (res === null) throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Invoice updated successfully',
            invoice: res
        };
    }

    @Delete(':id')
    public async delete(@Req() req: ReqUser, @Param('id', new ParseUUIDPipe()) id: string): Promise<unknown> {
        const res = await this.service.deleteInvoice(id, req['user']['id']);

        if (res === undefined) throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
        if (res === null) throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);

        return { message: 'Invoice deleted' };
    }
}
