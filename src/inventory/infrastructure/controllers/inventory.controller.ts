import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { InventoryService } from '../../application/services/inventory.service';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { CreateInventoryDto, UpdateInventoryDto } from '../dtos';
import { InventoyResponse } from '../../domain/types';
import { InventoryQueries } from '../../domain/types/inventory-queries.type';

@ApiBearerAuth()
@ApiTags('Inventories')
@Controller('inventories')
export class InventoryController {

    constructor(private service: InventoryService) { }

    @ApiOperation({ summary: "Get all customer's inventories" })
    @ApiResponse({ status: 200, type: InventoryEntity, isArray: true })
    @ApiResponse({ status: 400, description: 'Page param missing' })
    @ApiQuery({ name: 'page', required: true })
    @ApiQuery({ name: 'fields', required: false, description: 'Fields you want to fetch in your response' })
    @ApiQuery({ name: 'q', required: false, description: 'Query earch term' })
    @Get('/all/:customer-id')
    public async findAll(@Param('customer-id') customerId: string, @Query() queries: InventoryQueries): Promise<Partial<InventoryEntity>[]> {
        if (!queries.page || !queries) throw new HttpException('page query param is missing in url', HttpStatus.BAD_REQUEST);

        return this.service.findAllInventories(customerId, queries.page, queries.fields, queries.q);
    }

    @ApiOperation({ summary: "Get a inventory by id" })
    @ApiResponse({ status: 200, type: InventoryEntity })
    @ApiResponse({ status: 400, description: 'Invalid id' })
    @ApiResponse({ status: 404, description: 'Inventory not found' })
    @ApiQuery({ name: 'fields', required: false, description: 'Fields you want to fetch in your response' })
    @Get(':id')
    public async findOne(@Param('id', new ParseUUIDPipe()) id: string, @Query('fields') fields?: string): Promise<Partial<InventoryEntity>> {
        const res: Partial<InventoryEntity> = await this.service.findOneInventory(id, fields);

        if (!res) throw new HttpException('Inventory not found', HttpStatus.NOT_FOUND);

        return res;
    }

    @ApiOperation({ summary: 'Create a inventory' })
    @ApiResponse({ status: 201, description: 'Inventory created succesfully' })
    @ApiResponse({ status: 400, description: 'Validations error' })
    @Post()
    public async create(@Body() newInventory: CreateInventoryDto): Promise<InventoyResponse> {
        const res: InventoryEntity = await this.service.createInventory(newInventory);

        if (res === undefined) throw new HttpException('Inventory not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Inventory created succesfully',
            data: res
        };
    }

    @ApiOperation({ summary: 'Update inventory' })
    @ApiResponse({ status: 200, description: 'Inventory updated' })
    @ApiResponse({ status: 400, description: 'Validations error' })
    @ApiResponse({ status: 404, description: 'Inventory not found' })
    @Patch(':id')
    public async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() inventory: UpdateInventoryDto): Promise<InventoyResponse> {
        const res: InventoryEntity = await this.service.updateInventory(id, inventory);

        return {
            message: 'Inventory updated succesfully',
            data: res
        };
    }

    @ApiOperation({ summary: 'Delete inventory' })
    @ApiResponse({ status: 200, description: 'Inventory deleted' })
    @ApiResponse({ status: 400, description: 'Invalid id' })
    @ApiResponse({ status: 404, description: 'Inventory not found' })
    @Delete(':id')
    public async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<InventoyResponse> {
        const res: InventoryEntity = await this.service.deleteInventory(id);

        if (!res) throw new HttpException('Inventory not found', HttpStatus.NOT_FOUND);

        return { message: 'Inventory deleted succesfully' };
    }
}
