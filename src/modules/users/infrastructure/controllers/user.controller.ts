import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { UserService } from '../../application/services/user.service';
import { bad_req, not_found, server_error, success } from '../config/swagger-response.config';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor(private service: UserService) {}

    @ApiOperation({ summary: 'Gets a user' })
    @ApiOkResponse({ type: UserEntity })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'User id'})
    @Get(':id')
    public async find(@Param('id', ParseUUIDPipe) id: string): Promise<UserEntity> {
        const user: UserEntity = await this.service.findUser(id);

        if (user === null) throw new HttpException('User not found, invalid id', HttpStatus.NOT_FOUND);
        if (user === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return user;
    }

    @ApiOperation({ summary: 'Creates a user' })
    @ApiResponse(success)
    @ApiResponse(bad_req)
    @ApiResponse(server_error)
    @Post()
    public async create(@Body() body: CreateUserDto): Promise<UserEntity> {
        const user: UserEntity = await this.service.createUser(body);

        if (!user) throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);

        return user;
    }

    @ApiOperation({ summary: 'Updates a user' })
    @ApiResponse(success)
    @ApiResponse(bad_req)
    @ApiResponse(not_found)
    @ApiResponse(server_error)
    @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'User id'})
    @Patch(':id')
    public async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateUserDto): Promise<UserEntity> {
        const user: User = await this.service.updateUser(id, body);

        if (user === null) throw new HttpException('User not found, invalid id', HttpStatus.BAD_REQUEST);
        if (user === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (!user) throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);

        return user;
    }

    @ApiOperation({ summary: 'Deletes a user' })
    @ApiOkResponse({ type: Error })
    @ApiResponse(bad_req)
    @ApiResponse(not_found)
    @ApiResponse(server_error)
    @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'User id'})
    @Delete(':id')
    public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
        const res: string = await this.service.deleteUser(id);

        if (res === null) throw new HttpException('User not found, invalid id', HttpStatus.BAD_REQUEST);
        if (res === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return res;
    }
}