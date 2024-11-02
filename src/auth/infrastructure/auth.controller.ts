import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';

import { AuthEntity } from '../domain/entities/auth.entity';
import { LoginUserDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from '../domain/dtos';
import { AuthService } from '../application/services/auth.service';
import { RefreshTokenGuard } from '../application/guards/refresh-token/refresh-token.guard';
import { ApiActivateAccount, ApiForgotPassword, ApiLogin, ApiLogout, ApiRefresh, ApiResetPassword } from '../application/decorators';
import { PublicAccess } from '../../common/application/decorators';

@ApiTags('Authentication')
@PublicAccess()
@Throttle({ default: { ttl: 3000, limit: 3 }})
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @ApiLogin()
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    public async login(@Body() credentials: LoginUserDto): Promise<unknown> {
        const res: AuthEntity = await this.authService.login(credentials);

        if (!res) throw new HttpException('Wrong credentials', HttpStatus.NOT_ACCEPTABLE);

        return {
            message: 'Login successfull',
            access_token: res.access_token,
            refresh_token: res.refresh_token
        };
    }

    @ApiRefresh()
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshTokenGuard)
    @Post('/refresh')
    public async refresh(@Req() req: Request, @Body() token: RefreshTokenDto): Promise<string> {
        const res: string = await this.authService.refreshTokens(req['refresh_token']['id'], token.refresh_token);

        if (res === null) throw new HttpException('Session expired', HttpStatus.UNAUTHORIZED);
        if (res === undefined) throw new HttpException('Invalid token', HttpStatus.NOT_ACCEPTABLE);

        return res;
    }

    @ApiLogout()
    @UseGuards(RefreshTokenGuard)
    @Get('/logout')
    public async logOut(@Req() req: Request): Promise<string> {
        const res: string = await this.authService.logOut(req['refresh_token']['id']);

        if (res === null) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (res === undefined) throw new HttpException('User could not logout', HttpStatus.INTERNAL_SERVER_ERROR);

        return res;
    }

    @ApiForgotPassword()
    @HttpCode(HttpStatus.OK)
    @Post('/forgot')
    public async forgotPassword(@Body() body: ForgotPasswordDto): Promise<unknown> {
        await this.authService.forgotPassword(body.email);

        return { message: 'If this user exist, an email will be sent by e-mail' };
    }

    @ApiActivateAccount()
    @Get('/activate')
    public async activateAccount(@Query('token') token: string): Promise<{ message: string }> {
        const res: string = await this.authService.activateAccount(token);

        if (!res) throw new HttpException('Invalid token', HttpStatus.CONFLICT);

        return { message: res };
    }

    @ApiResetPassword()
    @HttpCode(HttpStatus.OK)
    @Post('/reset')
    public async resetPassword(@Body() body: ResetPasswordDto, @Query('token') token: string): Promise<{ message: string }> {
        const res = await this.authService.resetPassword(token, body.password);

        if (!res) throw new HttpException('Invalid token', HttpStatus.CONFLICT);
        
        return { message: 'Password updated successfully' }
    }
}