import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { WeatherModule } from './weather.module';
import { MailModule } from './mail.module';

@Module({
    imports: [PrismaModule, WeatherModule, MailModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
