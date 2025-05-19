import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from '../service/mail.service';
import { WeatherModule } from './weather.module';

@Module({
    imports: [ConfigModule, WeatherModule],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
