import { Frequency } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserConfirmationDto {
    @ApiProperty({ example: 'example.email@gmail.com' })
    email: string;

    @ApiProperty({ example: 'Kyiv' })
    city: string;

    @ApiProperty({ example: 'daily' })
    frequency: Frequency;
}
