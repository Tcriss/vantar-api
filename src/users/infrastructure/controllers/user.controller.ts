import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { UserService } from '../../application/services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { ReqUser } from '../../domain/types/req-user.type';
import { PublicAccess } from '../../../common/application/decorators/public.decorator';
import { UserQueries } from '../../domain/types/user-queries.type';

@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor(private service: UserService) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Gets a user' })
    @ApiResponse({ type: UserEntity, isArray: true })
    @ApiResponse({ status: 403, description: 'Without enough permissions' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @ApiQuery({ name: 'page', required: true, example: '0, 10' })
    @ApiQuery({ name: 'q', required: false, description: 'search param to filter results' })
    @ApiQuery({ name: 'selected', required: false, description: 'fields you want to select from response' })
    @Get()
    public async findAll(@Req() req: ReqUser, @Query() queries?: UserQueries): Promise<Partial<UserEntity>[]> {
        if (!req.user) throw new HttpException('credentials missing', HttpStatus.BAD_REQUEST);

        const users: Partial<UserEntity>[] = await this.service.findAllUsers(req.user.role, queries.page, queries.selected, queries.q);

        if (users === null) throw new HttpException('Without enough permissions', HttpStatus.FORBIDDEN);

        return users;
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Gets a user' })
    @ApiResponse({ type: UserEntity })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @ApiParam({ name: 'id', description: 'User id', format: 'uuid' })
    @Get(':id')
    public async findOne(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: ReqUser): Promise<UserEntity> {
        if (req.user.role === 'CUSTOMER') {
            if (req.user.id !== id) throw new HttpException('Wrong credentials', HttpStatus.FORBIDDEN);
        };

        const user: UserEntity = await this.service.findOneUser(id);

        if (user === null) throw new HttpException('User not found, invalid id', HttpStatus.BAD_REQUEST);
        if (user === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return user;
    }
    
    @PublicAccess()
    @ApiOperation({ summary: 'Creates a user' })
    @ApiResponse({ status: 201, description: 'User created succesfully' })
    @ApiResponse({ status: 400, description: 'Validations error' })
    @ApiResponse({ status: 409, description: 'User already exist or you are already logged, method not allowed' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @Post()
    public async create(@Body() body: CreateUserDto, @Req() req: ReqUser): Promise<UserEntity> {
        const isLogged: boolean = req.user ? true : false;
        const isExist: Boolean = await this.service.findOneUser(null, body.email) ? true : false;

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
    @ApiResponse({ status: 406, description: 'Wrong credentials' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiParam({ name: 'id', description: 'User id', format: 'uuid' })
    @Patch(':id')
    public async update(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: ReqUser, @Body() body: UpdateUserDto): Promise<UserEntity> {
        if (req.user.role === 'CUSTOMER') {
            if (req.user.id !== id) throw new HttpException('Wrong credentials', HttpStatus.FORBIDDEN);
        };

        const user: User = await this.service.updateUser(id, body, req.user.role);

        if (user === null) throw new HttpException('Wrong credentials', HttpStatus.NOT_ACCEPTABLE);
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
    @ApiParam({ name: 'id', description: 'User id', format: 'uuid' })
    @Delete(':id')
    public async delete(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: ReqUser): Promise<string> {
        if (req.user.role === 'CUSTOMER') {
            if (req.user.id !== id) throw new HttpException('Wrong credentials', HttpStatus.FORBIDDEN);
        };

        const res: string = await this.service.deleteUser(id);

        if (res === null) throw new HttpException('User not found, invalid id', HttpStatus.BAD_REQUEST);
        if (res === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return res;
    }
}