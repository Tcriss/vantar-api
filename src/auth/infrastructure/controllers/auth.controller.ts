import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LoginUserDto, RefreshTokenDto } from '../../domain/dtos';
import { Token } from '../../domain/types';
import { AuthService } from '../../application/services/auth.service';
import { PublicAccess } from '../../../common/application/decorators';
import { AuthResponseI } from '../../domain/interfaces/auth-response.interface';
import { RefreshTokenGuard } from '../../application/guards/refresh-token/refresh-token.guard';
import { ApiActivateAccount, ApiLogin, ApiLogout, ApiRefresh } from '../../application/decorators';

@ApiTags('Authentication')
@PublicAccess()
@Controller('auth')
export class AuthController {

    constructor(private service: AuthService) { }

    @ApiLogin()
    @HttpCode(200)
    @Post('/login')
    public async login(@Body() credentials: LoginUserDto): Promise<AuthResponseI> {
        const res: Token = await this.service.login(credentials);

        if (res === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (res === null) throw new HttpException('Wrong credentials', HttpStatus.NOT_ACCEPTABLE);

        return {
            message: 'Login successful',
            access_token: res.access_token,
            refresh_token: res.refresh_token
        };
    }

    @ApiRefresh()
    @HttpCode(200)
    @UseGuards(RefreshTokenGuard)
    @Post('/refresh')
    public async refresh(@Req() req: Request, @Body() token: RefreshTokenDto): Promise<string> {
        const res: string = await this.service.refreshTokens(req['refresh_token']['id'], token.refresh_token);

        if (res === null) throw new HttpException('Session expired', HttpStatus.UNAUTHORIZED);
        if (res === undefined) throw new HttpException('Invalid token', HttpStatus.NOT_ACCEPTABLE);

        return res;
    }

    @ApiLogout()
    @UseGuards(RefreshTokenGuard)
    @Get('/logout')
    public async logOut(@Req() req: Request): Promise<string> {
        const res: string = await this.service.logOut(req['refresh_token']['id']);

        if (res === null) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (res === undefined) throw new HttpException('User could not logout', HttpStatus.INTERNAL_SERVER_ERROR);

        return res;
    }

    @ApiActivateAccount()
    @Get('/activate')
    public async activateAccount(@Query('token') token: string): Promise<string> {
        const res: string = await this.service.activateAccount(token);

        if (res === null) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (res === undefined) throw new HttpException('Invalid token', HttpStatus.CONFLICT);

        return res;
    }
}