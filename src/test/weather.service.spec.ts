import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '../service/weather.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { of } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { Frequency } from '@prisma/client';

describe('WeatherService', () => {
    let service: WeatherService;
    let httpService: HttpService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WeatherService,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('fake-api-token'),
                    },
                },
                {
                    provide: PrismaService,
                    useValue: {
                        weather: {
                            create: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<WeatherService>(WeatherService);
        httpService = module.get<HttpService>(HttpService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should return daily forecast data', async () => {
        const mockData = {
            data: {
                forecast: {
                    forecastday: [
                        {
                            day: {
                                avgtemp_c: 20,
                                avghumidity: 60,
                                condition: { text: 'Sunny' },
                            },
                        },
                    ],
                },
            },
        };

        (httpService.get as jest.Mock).mockReturnValue(of(mockData));

        const result = await service.getForecast('Kyiv', 'daily');

        expect(result.temperature).toBe(20);
        expect(result.humidity).toBe(60);
        expect(result.description).toBe('Sunny');
    });

    it('should return hourly forecast data', async () => {
        const hourIndex = new Date().getHours() - 1;
        const mockData = {
            data: {
                forecast: {
                    forecastday: [
                        {
                            hour: [] as {
                                temp_c: number;
                                humidity: number;
                                condition: { text: string };
                            }[],
                        },
                    ],
                },
            },
        };

        for (let i = 0; i < 24; i++) {
            mockData.data.forecast.forecastday[0].hour.push({
                temp_c: 15 + i,
                humidity: 50 + i,
                condition: { text: `Clear ${i}` },
            });
        }

        (httpService.get as jest.Mock).mockReturnValue(of(mockData));

        const result = await service.getForecast('Kyiv');

        expect(result.temperature).toBe(15 + hourIndex);
        expect(result.humidity).toBe(50 + hourIndex);
        expect(result.description).toBe(`Clear ${hourIndex}`);
    });

    it('should throw BadRequestException for empty forecast', async () => {
        const mockData = {
            data: {
                forecast: {
                    forecastday: [],
                },
            },
        };

        (httpService.get as jest.Mock).mockReturnValue(of(mockData));

        await expect(service.getForecast('UnknownCity')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('should throw BadRequestException for missing city', async () => {
        await expect(service.getForecast('')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('should save forecast to database', async () => {
        const mockData = {
            data: {
                forecast: {
                    forecastday: [
                        {
                            day: {
                                avgtemp_c: 25,
                                avghumidity: 55,
                                condition: { text: 'Cloudy' },
                            },
                        },
                    ],
                },
            },
        };

        (httpService.get as jest.Mock).mockReturnValue(of(mockData));

        const createSpy = jest.spyOn(prisma.weather, 'create');

        const result = await service.getAndSaveForecast(
            'Lviv',
            Frequency.daily,
        );

        expect(createSpy).toHaveBeenCalledWith({
            data: {
                city: 'Lviv',
                temperature: 25,
                humidity: 55,
                description: 'Cloudy',
            },
        });

        expect(result.temperature).toBe(25);
        expect(result.humidity).toBe(55);
    });
});
