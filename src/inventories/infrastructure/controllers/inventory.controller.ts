import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { InventoryService } from '../../application/services/inventory.service';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { CreateInventoryDto, UpdateInventoryDto } from '../dtos';
import { InventoyResponse } from '../../domain/types';
import { InventoryQueries } from '../../domain/types/inventory-queries.type';
import { ReqUser } from '../../../common/domain/types';
import { ApiCreateInventory, ApiDeleteInventory, ApiGetInventories, ApiGetInventory, ApiUpdateInventory } from '../../../inventory/application/decorators/open-api.decorator';
import { RoleGuard } from '../../../auth/application/guards/role/role.guard';
import { Role } from '../../../common/application/decorators';
import { Roles } from '../../../common/domain/enums';

@ApiBearerAuth()
@ApiTags('Inventories')
@Role(Roles.CUSTOMER)
@UseGuards(RoleGuard)
@Controller('inventories')
export class InventoryController {

    constructor(private service: InventoryService) { }

    @ApiGetInventories()
    @Get()
    public async findAll(@Req() req: ReqUser, @Query() queries: InventoryQueries): Promise<Partial<InventoryEntity>[]> {
        if (!queries.page || !queries) throw new HttpException('page query param is missing in url', HttpStatus.BAD_REQUEST);

        return this.service.findAllInventories(req.user.id, queries.page, queries.fields, queries.q);
    }

    @ApiGetInventory()
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
    @Patch(':id')
    public async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() inventory: UpdateInventoryDto): Promise<InventoyResponse> {
        const res: InventoryEntity = await this.service.updateInventory(id, inventory);

        return {
            message: 'Inventory updated succesfully',
            data: res
        };
    }

    @ApiDeleteInventory()
    @Delete(':id')
    public async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<InventoyResponse> {
        const res: InventoryEntity = await this.service.deleteInventory(id);

        if (!res) throw new HttpException('Inventory not found', HttpStatus.NOT_FOUND);

        return { message: 'Inventory deleted succesfully' };
    }
}
