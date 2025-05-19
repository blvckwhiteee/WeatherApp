import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather.module';
import { UserModule } from './user.module';
import { MailModule } from './mail.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        WeatherModule,
        UserModule,
        MailModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
