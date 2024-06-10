import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { LoginUserDto } from '../dto';
import { AuthService } from '../../application/services/auth.service';
import { Token } from '../../domain/types';
import { AuthEntity } from '../../domain/entities/auth.entity';
import { GoogleGuard } from '../../application/guards/google/google.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(private service: AuthService) { }

    @ApiOperation({ summary: 'Sing in a user' })
    @ApiOkResponse({ type: AuthEntity, description: 'User logged in successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 406, description: 'Wrong credentials' })
    @HttpCode(200)
    @Post('login')
    public async login(@Body() credentials: LoginUserDto): Promise<{ message: string, access_token: string }> {
        const res: Token = await this.service.logIn(credentials);

        if (res === undefined) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        if (res === null) throw new HttpException('Wrong credentials', HttpStatus.NOT_ACCEPTABLE);

        return {
            message: 'Login successful',
            access_token: res.access_token
        };
    }

    @ApiOperation({ summary: 'Sing in a user with google account' })
    @ApiOkResponse({ type: AuthEntity, description: 'User logged in successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 406, description: 'Wrong credentials' })
    @UseGuards(GoogleGuard)
    @Get('google')
    public async loginWithGoogle(): Promise<void> { }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    async googleAuthCallback(@Req() req: { user: LoginUserDto }, @Res() res: Response): Promise<string> {
        const token = await this.service.logIn(req.user);

        res.cookie('access_token', token, {
            maxAge: 2592000000,
            sameSite: true,
            secure: false,
        });

        return 'Login successful';
    }
}