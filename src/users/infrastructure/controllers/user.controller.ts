import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { UserService } from '../../application/services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { ReqUser } from '../../domain/types/req-user.type';
import { PublicAccess } from '../../../common/application/decorators/public.decorator';
import { UserQueries } from '../../domain/types/user-queries.type';
import { ApiCreateUser, ApiDeleteUser, ApiGetUser, ApiGetUsers, ApiUpdateUser } from 'src/users/application/decorators/open-api.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor(private service: UserService) { }

    @ApiGetUsers()
    @Get()
    public async findAll(@Req() req: ReqUser, @Query() queries?: UserQueries): Promise<Partial<UserEntity>[]> {
        if (!req.user) throw new HttpException('credentials missing', HttpStatus.BAD_REQUEST);

        const users: Partial<UserEntity>[] = await this.service.findAllUsers(req.user.role, queries.page, queries.selected, queries.q);

        if (users === null) throw new HttpException('Without enough permissions', HttpStatus.FORBIDDEN);

        return users;
    }

    @ApiGetUser()
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

    @ApiDeleteUser()
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