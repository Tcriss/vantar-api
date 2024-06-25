import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LoginUserDto } from '../dto';
import { Token } from '../../domain/types';
import { AuthService } from '../../application/services/auth.service';
import { PublicAccess } from '../../../common/application/decorators';
import { AuthResponseI } from '../../domain/interfaces/auth-response.interface';
import { RefreshTokenGuard } from '../../application/guards/refresh-token/refresh-token.guard';
import { ReqUser } from '../../../common/domain/types';
import { ApiLogin, ApiLogout, ApiRefresh } from '../../application/decorators/open-api.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(private service: AuthService) { }

    @ApiLogin()
    @PublicAccess()
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
    public async refresh(@Req() req: ReqUser): Promise<any> {
        const res = await this.service.refreshTokens(req.user.id, req['refresh']);

        if (res === null) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (res === undefined) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

        return res;
    }

    @ApiLogout()
    @UseGuards(RefreshTokenGuard)
    @Get('/logout')
    public async logOut(@Req() req: Request): Promise<string> {
        const res: string = await this.service.logOut(req['user']['id']);

        if (res === null) throw new HttpException('User nor found', HttpStatus.NOT_FOUND);
        if (res === undefined) throw new HttpException('User could not logout', HttpStatus.INTERNAL_SERVER_ERROR);

        return res;
    }
}