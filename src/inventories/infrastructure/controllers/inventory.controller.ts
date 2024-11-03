import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { InventoryEntity } from '@inventories/domain/entities';
import { CreateInventoryDto, UpdateInventoryDto } from '@inventories/domain/dtos';
import { InventoyResponse, InventoryQueries } from '@inventories/domain/types';
import { InventoryService } from '@inventories/application/services';
import { ApiCreateInventory, ApiDeleteInventory, ApiGetInventories, ApiGetInventory, ApiUpdateInventory } from '@inventories/application/decorators';
import { Role } from '@common/application/decorators';
import { Roles } from '@common/domain/enums';
import { RoleGuard, OwnerGuard } from '@auth/application/guards';

@ApiBearerAuth()
@ApiTags('Inventories')
@Role(Roles.CUSTOMER)
@UseGuards(RoleGuard)
@Controller('inventories')
export class InventoryController {

    constructor(private readonly service: InventoryService) { }

    @ApiGetInventories()
    @UseGuards(OwnerGuard)
    @Get()
    public async findAll(@Query() queries: InventoryQueries): Promise<Partial<InventoryEntity>[]> {
        const { page, limit, shop, q, fields } = queries;

        return this.service.findAllInventories(
            shop,
            {
                skip: (page - 1) * limit,
                take: limit || 10
            }, 
            fields
        );
    }

    @ApiGetInventory()
    @UseGuards(OwnerGuard)
    @Get(':id')
    public async findOne(@Param('id', new ParseUUIDPipe()) id: string, @Query('fields') fields?: string): Promise<Partial<InventoryEntity>> {
        const res: Partial<InventoryEntity> = await this.service.findOneInventory(id, fields);

        if (!res) throw new HttpException('Inventory not found', HttpStatus.NOT_FOUND);

        return res;
    }

    @ApiCreateInventory()
    @Post()
    public async create(@Body() newInventory: CreateInventoryDto): Promise<InventoyResponse> {      
        const res: InventoryEntity = await this.service.createInventory(newInventory);

        if (res === undefined) throw new HttpException('Inventory not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Inventory created succesfully',
            data: res
        };
    }

    @ApiUpdateInventory()
    @UseGuards(OwnerGuard)
    @Patch(':id')
    public async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() inventory: UpdateInventoryDto): Promise<InventoyResponse> {
        const res: InventoryEntity = await this.service.updateInventory(id, inventory); 

        if (!res) throw new HttpException('Inventory not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Inventory updated succesfully',
            data: res
        };
    }

    @ApiDeleteInventory()
    @UseGuards(OwnerGuard)
    @Delete(':id')
    public async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<InventoyResponse> {
        const res: InventoryEntity = await this.service.deleteInventory(id); 

        if (!res) throw new HttpException('Inventory not found', HttpStatus.NOT_FOUND);

        return { message: 'Inventory deleted succesfully' };
    }
}
