import { ApiProperty } from '@nestjs/swagger';
import { Frequency } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class UserInfo {
    @IsNotEmpty()
    @ApiProperty({ example: 'example.email@gmail.com' })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'daily' })
    frequency: Frequency;

    @IsNotEmpty()
    @ApiProperty({ example: 'Kyiv' })
    city: string;

    token: string;
}
