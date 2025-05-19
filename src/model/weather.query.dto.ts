import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WeatherQueryDto {
    @ApiProperty({
        description: 'City name for weather forecast',
        example: 'Kyiv',
    })
    @IsString()
    @IsNotEmpty()
    city: string;
}
