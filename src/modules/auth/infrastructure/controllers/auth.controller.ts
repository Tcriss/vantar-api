import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoginUserDto } from '../dto';
import { AuthService } from '../../application/services/auth.service';
import { Token } from '../../domain/types';
import { AuthEntity } from '../../domain/entities/auth.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(private service: AuthService) {}

    @ApiOperation({ summary: 'Sing in a user' })
    @ApiOkResponse({ type: AuthEntity, description: 'User logged in successfully'})
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 406, description: 'Wrong credentials' })
    @HttpCode(200)
    @Post('login')
    public async login(@Body() credentials: LoginUserDto): Promise<Token> {
        const res: Token = await this.service.logIn(credentials);

        if (res === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (res === null) throw new HttpException('Wrong credentials', HttpStatus.NOT_ACCEPTABLE);

        return res;
    }
}