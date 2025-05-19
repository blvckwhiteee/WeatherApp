import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WeatherReceiveDto {
    @IsNotEmpty()
    @ApiProperty({ example: 22 })
    temperature: number;

    @IsNotEmpty()
    @ApiProperty({ example: 100 })
    humidity: number;

    @IsNotEmpty()
    @ApiProperty({ example: 'Clear sky' })
    description: string;
}
