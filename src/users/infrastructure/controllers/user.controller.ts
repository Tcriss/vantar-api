import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto, UpdateUserDto } from '../../domain/dtos';
import { UserQueries } from '../../domain/types';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserService } from '../../application/services/user.service';
import { PublicAccess, Role } from '../../../common/application/decorators';
import { ApiCreateUser, ApiDeleteUser, ApiGetUser, ApiGetUsers, ApiUpdateUser } from '../../application/decorators';
import { UserGuard } from '../../application/guards/user.guard';
import { UserFieldsInterceptor } from '../../application/interceptors/user-fields.interceptor';
import { RoleGuard } from '../../../auth/application/guards/role/role.guard';
import { Roles } from '../../../common/domain/enums';
import { CreateUserGuard } from '../../application/guards/create-user.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor(private service: UserService) { }

    @ApiGetUsers()
    @Role(Roles.ADMIN)
    @UseGuards(RoleGuard)
    @UseInterceptors(UserFieldsInterceptor)
    @Get()
    public async findAll(@Req() req: Request, @Query() queries?: UserQueries): Promise<UserEntity[] | Partial<UserEntity>[]> {
        if (!req['user']) throw new HttpException('credentials missing', HttpStatus.BAD_REQUEST);

        return this.service.findAllUsers(queries.page, queries.q);
    }

    @ApiGetUser()
    @Role(Roles.ADMIN, Roles.CUSTOMER)
    @UseGuards(RoleGuard, UserGuard)
    @UseInterceptors(UserFieldsInterceptor)
    @Get(':id')
    public async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserEntity> {
        const user: UserEntity = await this.service.findOneUser(id);

        if (user === null) throw new HttpException('User not found, invalid id', HttpStatus.BAD_REQUEST);
        if (user === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return user;
    }
    
    @ApiCreateUser()
    @PublicAccess()
    @UseGuards(CreateUserGuard)
    @UseInterceptors(UserFieldsInterceptor)
    @Post()
    public async create(@Body() body: CreateUserDto, @Req() req?: Request): Promise<UserEntity> {
        const isExist: Boolean = await this.service.findOneUser(null, body.email) ? true : false;

        if (req['user'] && req['user']['role'] === Roles.CUSTOMER) throw new HttpException('Cannot register when logged in', HttpStatus.FORBIDDEN);
        if (!req['user'] && body.role === Roles.ADMIN) throw new HttpException('Not enough permissions', HttpStatus.NOT_ACCEPTABLE);
        if (isExist) throw new HttpException('This user already exists', HttpStatus.NOT_ACCEPTABLE);

        const user: UserEntity = await this.service.createUser(body);

        return user;
    }

    @ApiUpdateUser()
    @Role(Roles.ADMIN, Roles.CUSTOMER)
    @UseGuards(RoleGuard, UserGuard)
    @UseInterceptors(UserFieldsInterceptor)
    @Patch(':id')
    public async update(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: Request, @Body() body: UpdateUserDto): Promise<UserEntity> {
        const user: UserEntity = await this.service.updateUser(id, body, req['user']['role']);

        if (user === null) throw new HttpException('Wrong credentials', HttpStatus.NOT_ACCEPTABLE);
        if (user === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (!user) throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);

        return user;
    }

    @ApiDeleteUser()
    @Role(Roles.ADMIN, Roles.CUSTOMER)
    @UseGuards(RoleGuard, UserGuard)
    @Delete(':id')
    public async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<unknown> {
        const res: string = await this.service.deleteUser(id);

        if (!res) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return { message: res };
    }
}