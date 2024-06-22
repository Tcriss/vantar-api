import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Role } from '../../../common/domain/enums';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { ReqUser, UserQueries } from '../../domain/types';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserService } from '../../application/services/user.service';
import { PublicAccess, Roles } from '../../../common/application/decorators';
import { ApiCreateUser, ApiDeleteUser, ApiGetUser, ApiGetUsers, ApiUpdateUser } from '../../application/decorators/open-api.decorator';
import { RoleGuard } from 'src/auth/application/guards/role/role.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor(private service: UserService) { }

    @ApiGetUsers()
    @Roles(Role.ADMIN)
    @UseGuards(RoleGuard)
    @Get()
    public async findAll(@Req() req: ReqUser, @Query() queries?: UserQueries): Promise<UserEntity[]> {
        if (!req.user) throw new HttpException('credentials missing', HttpStatus.BAD_REQUEST);

        return this.service.findAllUsers(queries.page, queries.q);
    }

    @ApiGetUser()
    @Roles(Role.ADMIN, Role.CUSTOMER)
    @UseGuards(RoleGuard)
    @Get(':id')
    public async findOne(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: ReqUser): Promise<UserEntity> {
        if (req.user.id !== id && req.user.role === Role.CUSTOMER) throw new HttpException('Without enough permissions', HttpStatus.FORBIDDEN);

        const user: UserEntity = await this.service.findOneUser(id);

        if (user === null) throw new HttpException('User not found, invalid id', HttpStatus.BAD_REQUEST);
        if (user === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return user;
    }
    
    @ApiCreateUser()
    @PublicAccess()
    @Post()
    public async create(@Body() body: CreateUserDto, @Req() req: ReqUser): Promise<UserEntity> {
        const isLogged: boolean = req.user ? true : false;
        const isExist: Boolean = await this.service.findOneUser(null, body.email) ? true : false;

        if (isLogged) throw new HttpException('You are already authenticated', HttpStatus.NOT_ACCEPTABLE);
        if (isExist) throw new HttpException('This user already exists', HttpStatus.NOT_ACCEPTABLE);

        const user: UserEntity = await this.service.createUser(body);

        return user;
    }

    @ApiUpdateUser()
    @Roles(Role.ADMIN, Role.CUSTOMER)
    @UseGuards(RoleGuard)
    @Patch(':id')
    public async update(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: ReqUser, @Body() body: UpdateUserDto): Promise<UserEntity> {
        if (req.user.id !== id && req.user.role === Role.CUSTOMER) throw new HttpException('Without enough permissions', HttpStatus.FORBIDDEN);

        const user: UserEntity = await this.service.updateUser(id, body, req.user.role);

        if (user === null) throw new HttpException('Wrong credentials', HttpStatus.NOT_ACCEPTABLE);
        if (user === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (!user) throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);

        return user;
    }

    @ApiDeleteUser()
    @Roles(Role.ADMIN, Role.CUSTOMER)
    @UseGuards(RoleGuard)
    @Delete(':id')
    public async delete(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: ReqUser): Promise<string> {
        if (req.user.id !== id && req.user.role === Role.CUSTOMER) throw new HttpException('Without enough permissions', HttpStatus.FORBIDDEN);

        const res: string = await this.service.deleteUser(id);

        if (res === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        return res;
    }
}