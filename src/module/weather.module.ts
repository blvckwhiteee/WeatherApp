import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { WeatherController } from '../controller/weather.controller';
import { WeatherService } from '../service/weather.service';

@Module({
    imports: [HttpModule, ConfigModule, PrismaModule],
    controllers: [WeatherController],
    providers: [WeatherService],
    exports: [WeatherService],
})
export class WeatherModule {}
