import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from '../controller/weather.controller';
import { WeatherService } from '../service/weather.service';
import { WeatherReceiveDto } from '../model/weather.receive.dto';
import { WeatherQueryDto } from '../model/weather.query.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('WeatherController', () => {
    let controller: WeatherController;
    let service: WeatherService;

    const mockWeather: WeatherReceiveDto = {
        temperature: 20,
        humidity: 65,
        description: 'Sunny',
    };

    const mockWeatherService = {
        getForecast: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WeatherController],
            providers: [
                {
                    provide: WeatherService,
                    useValue: mockWeatherService,
                },
            ],
        }).compile();

        controller = module.get<WeatherController>(WeatherController);
        service = module.get<WeatherService>(WeatherService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return weather forecast successfully', async () => {
        mockWeatherService.getForecast.mockResolvedValue(mockWeather);

        const query: WeatherQueryDto = { city: 'London' };
        const result = await controller.getForecast(query);

        expect(result).toEqual(mockWeather);
        expect(service.getForecast).toHaveBeenCalledWith('London');
    });

    it('should throw NotFoundException if city is not found', async () => {
        mockWeatherService.getForecast.mockRejectedValue(
            new NotFoundException("City 'InvalidCity' not found"),
        );

        const query: WeatherQueryDto = { city: 'InvalidCity' };

        await expect(controller.getForecast(query)).rejects.toThrow(
            NotFoundException,
        );
        expect(service.getForecast).toHaveBeenCalledWith('InvalidCity');
    });

    it('should throw BadRequestException on service failure', async () => {
        mockWeatherService.getForecast.mockRejectedValue(
            new BadRequestException('Failed to retrieve weather data'),
        );

        const query: WeatherQueryDto = { city: '' };

        await expect(controller.getForecast(query)).rejects.toThrow(
            BadRequestException,
        );
        expect(service.getForecast).toHaveBeenCalledWith('');
    });
});
