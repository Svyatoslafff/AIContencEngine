import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/validation/auth.dto';
import { IncomingHttpHeaders } from 'http';

type user = {
    password: string;
    email: string;
};

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() { email, password }: LoginUserDto) {
        const data = await this.authService.loginUser(email, password);
        return {
            status: 200,
            data,
        };
    }
    @Post('register')
    async registerUser(@Body() { password, email }: CreateUserDto) {
        const data = await this.authService.createUser(email, password);
        return {
            status: 201,
            data,
        };
    }
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshUser(@Headers() headers: IncomingHttpHeaders) {
        const token = headers.authorization;
        const data = await this.authService.refreshUser(token);
        return {
            status: 200,
            data,
        };
    }
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logoutUser(@Headers() headers: IncomingHttpHeaders) {
        const token = headers.authorization;
        const data = await this.authService.logoutUser(token);

        return {
            status: 200,
            message: 'User successfully logged out',
        };
    }
    // @Patch('login/:id')
    // updateUserInfo(@Param('id') id: string) {
    //     return id;
    // }
    // @Delete('delete/:id')
    // deleteUser(@Param('id') id: string) {
    //     return id;
    // }
}
