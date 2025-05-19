import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import {
    ApiTags,
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserInfo } from '../model/user.info';
import { UserService } from '../service/user.service';

@ApiTags('Subscription')
@Controller('api')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('subscribe')
    @HttpCode(200)
    @ApiOkResponse({
        description: 'Subscription successful. Confirmation email sent.',
    })
    @ApiBadRequestResponse({ description: 'Invalid input' })
    @ApiConflictResponse({ description: 'Email already subscribed' })
    subscribe(@Body() userInfo: UserInfo) {
        return this.userService.subscribe(userInfo);
    }

    @Get('confirm/:token')
    @ApiOkResponse({ description: 'Subscription confirmed successfully' })
    @ApiBadRequestResponse({ description: 'Invalid token' })
    @ApiNotFoundResponse({ description: 'Token not found' })
    async confirm(@Param('token') token: string) {
        await this.userService.confirm(token);
        return { message: 'Subscription confirmed successfully' };
    }

    @Get('unsubscribe/:token')
    @ApiOkResponse({ description: 'Unsubscribed successfully' })
    @ApiBadRequestResponse({ description: 'Invalid token' })
    @ApiNotFoundResponse({ description: 'Token not found' })
    async unsubscribe(@Param('token') token: string) {
        await this.userService.unsubscribe(token);
        return { message: 'Unsubscribed successfully' };
    }
}
