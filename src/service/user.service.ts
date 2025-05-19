import {
    Injectable,
    ConflictException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserConfirmationDto } from '../model/user.confirmation.dto';
import { MailService } from './mail.service';
import { UserInfo } from '../model/user.info';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private mail: MailService,
    ) {}

    async subscribe(userInfo: UserInfo) {
        if (!userInfo.email || !userInfo.city || !userInfo.frequency) {
            throw new BadRequestException('Missing required fields');
        }

        const existing = await this.prisma.subscription.findFirst({
            where: { email: userInfo.email },
        });

        if (existing) {
            throw new ConflictException('Email already subscribed');
        }

        const token = randomUUID();

        await this.prisma.subscription.create({
            data: {
                email: userInfo.email,
                city: userInfo.city,
                frequency: userInfo.frequency,
                token,
            },
        });

        const confirmationDto = new UserConfirmationDto();
        confirmationDto.city = userInfo.city;
        confirmationDto.email = userInfo.email;
        confirmationDto.frequency = userInfo.frequency;

        this.mail.sendConfirmation(confirmationDto, token);

        return {
            statusCode: 200,
            message: 'Subscription successful. Confirmation email sent.',
        };
    }

    async confirm(token: string) {
        if (!token || typeof token !== 'string') {
            throw new BadRequestException('Invalid token');
        }

        const existing = await this.prisma.subscription.findUnique({
            where: { token },
        });

        if (!existing) {
            throw new NotFoundException('Token not found');
        }

        return this.prisma.subscription.update({
            where: { token },
            data: { confirmed: true },
        });
    }

    async unsubscribe(token: string) {
        if (!token || typeof token !== 'string') {
            throw new BadRequestException('Invalid token');
        }

        const existing = await this.prisma.subscription.findUnique({
            where: { token },
        });

        if (!existing) {
            throw new NotFoundException('Token not found');
        }

        return this.prisma.subscription.update({
            where: { token },
            data: { confirmed: false },
        });
    }
}
