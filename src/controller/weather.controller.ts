import {
    Controller,
    Get,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { WeatherReceiveDto } from '../model/weather.receive.dto';
import { WeatherQueryDto } from '../model/weather.query.dto';
import { WeatherService } from '../service/weather.service';
import {
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Weather')
@Controller()
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get('api/weather')
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOkResponse({
        description: 'Successful operation - current weather forecast returned',
        type: WeatherReceiveDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid request' })
    @ApiNotFoundResponse({ description: 'City not found' })
    getForecast(@Query() query: WeatherQueryDto): Promise<WeatherReceiveDto> {
        return this.weatherService.getForecast(query.city);
    }
}
