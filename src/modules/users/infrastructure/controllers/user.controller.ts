import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { UserService } from '../../application/services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { AccessTokenGuard } from '../../../auth/application/guards/access-token/access-token.guard';
import { ReqUser } from '../../domain/types/req-user.type';

@Controller('users') @ApiTags('Users')
export class UserController {

    constructor(private service: UserService) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Gets a user' })
    @ApiResponse({ type: UserEntity })
    @ApiResponse({ status: 400, description: 'Invalid id' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @UseGuards(AccessTokenGuard)
    @Get()
    public async find(@Req() req: ReqUser): Promise<UserEntity> {
        const user: UserEntity = await this.service.findUser(req.user.id);

        if (user === null) throw new HttpException('User not found, invalid id', HttpStatus.BAD_REQUEST);
        if (user === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return user;
    }

    @ApiOperation({ summary: 'Creates a user' })
    @ApiResponse({ status: 201, description: 'User created succesfully' })
    @ApiResponse({ status: 400, description: 'Validations error' })
    @ApiResponse({ status: 409, description: 'User already exist or you are already logged, method not allowed' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @Post()
    public async create(@Req() req: ReqUser, @Body() body: CreateUserDto): Promise<UserEntity> {
        const isLogged: boolean = req.user.id ? true : false;
        const isExist: Boolean = await this.service.findUser(null, body.email) ? true : false;

        if (isLogged) throw new HttpException('You are already authenticated', HttpStatus.NOT_ACCEPTABLE);
        if (isExist) throw new HttpException('This user already exists', HttpStatus.NOT_ACCEPTABLE);

        const user: UserEntity = await this.service.createUser(body);

        return user;
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Updates a user' })
    @ApiResponse({ status: 200, description: 'User created succesfully' })
    @ApiResponse({ status: 400, description: 'Validations error' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @UseGuards(AccessTokenGuard)
    @Patch()
    public async update(@Req() req: ReqUser, @Body() body: UpdateUserDto): Promise<UserEntity> {
        const user: User = await this.service.updateUser(req.user.id, body);

        if (user === null) throw new HttpException('User not found, invalid id', HttpStatus.BAD_REQUEST);
        if (user === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (!user) throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);

        return user;
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Deletes a user' })
    @ApiResponse({ status: 200, description: 'User deleted succesfully' })
    @ApiResponse({ status: 400, description: 'Validations error' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @UseGuards(AccessTokenGuard)
    @Delete()
    public async delete(@Req() req: ReqUser): Promise<string> {
        const res: string = await this.service.deleteUser(req.user.id);

        if (res === null) throw new HttpException('User not found, invalid id', HttpStatus.BAD_REQUEST);
        if (res === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return res;
    }
}