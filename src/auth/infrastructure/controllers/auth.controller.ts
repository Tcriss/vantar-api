import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoginUserDto } from '../dto';
import { AuthService } from '../../application/services/auth.service';
import { Token } from '../../domain/types';
import { AuthEntity } from '../../domain/entities/auth.entity';
import { PublicAccess } from '../../../common/application/decorators';
import { AuthResponseI } from '../../domain/interfaces/auth-response.interface';
import { RefreshTokenGuard } from '../../application/guards/refresh-token/refresh-token.guard';

@ApiTags('Authentication')
@PublicAccess()
@Controller('auth')
export class AuthController {

    constructor(private service: AuthService) { }

    @ApiOperation({ summary: 'Sing in a user' })
    @ApiResponse({ status: 200, type: AuthEntity })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 406, description: 'Wrong credentials' })
    @HttpCode(200)
    @Post('/login')
    public async login(@Body() credentials: LoginUserDto): Promise<AuthResponseI> {
        const res: Token = await this.service.logIn(credentials);

        if (res === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (res === null) throw new HttpException('Wrong credentials', HttpStatus.NOT_ACCEPTABLE);

        return {
            message: 'Login successful',
            access_token: res.access_token,
            refresh_token: res.refresh_token
        };
    }

    @ApiOperation({ summary: 'Refresh user token' })
    @ApiResponse({ status: 200, type: AuthEntity })
    @ApiResponse({ status: 401, description: 'Wrong credentials' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @HttpCode(200)
    @UseGuards(RefreshTokenGuard)
    @Post('/refresh')
    public async refresh(@Req() req: Request): Promise<any> {
        const res = await this.service.refreshTokens(req['user']['id'], req.headers['Authorization']);

        if (res === null) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (res === undefined) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

        return res;
    }

    @ApiOperation({ summary: 'Log out a user' })
    @ApiResponse({ status: 200, description: 'User logOut successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 406, description: 'Wrong credentials' })
    @UseGuards(RefreshTokenGuard)
    @Get('/logout')
    public async logOut(@Req() req: Request): Promise<string> {
        const res: string = await this.service.logOut(req['user']['id']);

        if (!res) throw new HttpException('User nor found', HttpStatus.NOT_FOUND);

        return res;
    }
}