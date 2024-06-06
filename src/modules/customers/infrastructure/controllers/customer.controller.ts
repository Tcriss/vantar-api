import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CustomerService } from '../../application/services/customer.service';
import { AccessTokenGuard } from '../../../auth/application/guards/access-token/access-token.guard';
import { ReqUser } from '../../../../common/types';
import { Pagination, CustomerResponse } from '../../domain/types';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos';
import { CustomerResponseEntity } from '../../domain/entities/customer-responses.entity';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('customers')
export class CustomerController {

    constructor(private service: CustomerService) {}

    @ApiOperation({ summary: 'Get all customers' })
    @ApiResponse({ status: 200, type: CustomerEntity, isArray: true })
    @ApiResponse({ status: 500, description: 'Server error' })
    @ApiQuery({ name: 'page', required: true, description: 'Paginate the results' })
    @ApiQuery({ name: 'fields', required: false, description: 'Fiels you want to fetch' })
    @ApiQuery({ name: 'q', required: false, description: 'Query to search results' })
    @Get()
    public async findAll(
        @Req() req: ReqUser, 
        @Query('page') page: Pagination, 
        @Query('fields') fields?: string,
        @Query('q') query?: string
    ): Promise<Partial<CustomerEntity>[]> {
        if (!page) throw new HttpException('Page query param is missing in url', HttpStatus.BAD_REQUEST);

        return this.service.findAllCustomers(req.user.id, page, query, fields);
    }

    @ApiOperation({ summary: 'Get a customer' })
    @ApiResponse({ status: 200, type: CustomerEntity })
    @ApiResponse({ status: 400, description: 'Invalid id' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @ApiQuery({ name: 'fields', required: false, description: 'Fiels you want to fetch' })
    @Get(':id')
    public async findOne(@Param('id', ParseUUIDPipe) id: string, @Query('fields') fields?: string): Promise<Partial<CustomerEntity>> {
        const customer: Partial<CustomerEntity> = await this.service.findOneCustomer(id, fields);

        if (!customer) throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);

        return customer;
    }

    @ApiOperation({ summary: 'Create a customer' })
    @ApiResponse({ status: 201, description: 'Customer created', type: CustomerResponseEntity })
    @ApiResponse({ status: 400, description: 'Validations error' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Post()
    public async create(@Req() req: ReqUser, @Body() customer: CreateCustomerDto): Promise<CustomerResponse> {
        const res: CustomerEntity = await this.service.createCustomer(req.user.id, customer);

        return {
            message: 'Customer created succesfully',
            data: res
        };
    }

    @ApiOperation({ summary: 'Update a customer' })
    @ApiResponse({ status: 200, type: CustomerResponseEntity })
    @ApiResponse({ status: 400, description: 'Validations error' })
    @ApiResponse({ status: 403, description: 'Forbidden action' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Patch(':id')
    public async update(@Req() req: ReqUser, @Param('id', ParseUUIDPipe) id: string, @Body() customer: UpdateCustomerDto): Promise<CustomerResponse> {
        const res: Partial<CustomerEntity> = await this.service.updateCustomer(req.user.id, id, customer);

        if (res === null) throw new HttpException('You are not the owner of this resource', HttpStatus.FORBIDDEN);
        if (res === undefined) throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Customer updated succesfully',
            data: res
        };
    }

    @ApiOperation({ summary: 'Delete a customer' })
    @ApiResponse({ status: 200, description: 'User deleted' })
    @ApiResponse({ status: 400, description: 'Invalid id' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @Delete(':id')
    public async delete(@Req() req: ReqUser, @Param('id', ParseUUIDPipe) id: string): Promise<CustomerResponse> {
        const res: Partial<CustomerEntity> = await this.service.deleteCustomer(req.user.id, id);

        if (res === null) throw new HttpException('You are not the owner of this resource', HttpStatus.FORBIDDEN);
        if (res === undefined) throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);

        return { message: 'Customer deleted succesfully' };
    }
}