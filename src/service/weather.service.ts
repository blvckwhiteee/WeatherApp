import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { WeatherReceiveDto } from '../model/weather.receive.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Frequency } from '@prisma/client';

@Injectable()
export class WeatherService {
    private readonly apiToken;

    constructor(
        private readonly httpService: HttpService,
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        this.apiToken = this.configService.get<string>('API_TOKEN');
    }

    public async getForecast(
        city: string,
        ...args
    ): Promise<WeatherReceiveDto> {
        let frequency;
        if (args.length == 1) frequency = args[0];

        if (!city) {
            throw new BadRequestException('City parameter is required');
        }

        try {
            const response = await firstValueFrom(
                this.httpService.get(
                    `http://api.weatherapi.com/v1/forecast.json?key=${this.apiToken}&q=${city}`,
                ),
            );

            const data = response.data;

            if (!data?.forecast?.forecastday?.length) {
                throw new NotFoundException(`City '${city}' not found`);
            }
            const weather = new WeatherReceiveDto();

            if (frequency === 'daily') {
                weather.temperature =
                    data.forecast.forecastday[0].day.avgtemp_c;
                weather.humidity = data.forecast.forecastday[0].day.avghumidity;
                weather.description =
                    data.forecast.forecastday[0].day.condition.text;
            } else {
                {
                    const date = new Date();
                    const hour = date.getHours();

                    weather.temperature =
                        data.forecast.forecastday[0].hour[hour - 1].temp_c;
                    weather.humidity =
                        data.forecast.forecastday[0].hour[hour - 1].humidity;
                    weather.description =
                        data.forecast.forecastday[0].hour[
                            hour - 1
                        ].condition.text;
                }
            }
            return weather;
        } catch (error) {
            if (error.response?.status === 400) {
                throw new NotFoundException(`City '${city}' not found`);
            }

            throw new BadRequestException('Failed to retrieve weather data');
        }
    }

    async getAndSaveForecast(city: string, frequency: Frequency) {
        const dto = this.getForecast(city, frequency);

        await this.prisma.weather.create({
            data: {
                city,
                temperature: (await dto).temperature,
                humidity: (await dto).humidity,
                description: (await dto).description,
            },
        });
        return dto;
    }
}
