import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../service/user.service';
import { MailService } from '../service/mail.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
    ConflictException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { UserInfo } from '../model/user.info';

describe('UserService', () => {
    let service: UserService;
    let prisma: PrismaService;
    let mail: MailService;

    const mockPrisma = {
        subscription: {
            findFirst: jest.fn(),
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };

    const mockMail = {
        sendConfirmation: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: MailService, useValue: mockMail },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        prisma = module.get<PrismaService>(PrismaService);
        mail = module.get<MailService>(MailService);

        jest.clearAllMocks();
    });

    it('should subscribe user', async () => {
        mockPrisma.subscription.findFirst.mockResolvedValue(null);
        mockPrisma.subscription.create.mockResolvedValue({});

        const dto: UserInfo = {
            email: 'test@example.com',
            city: 'Kyiv',
            frequency: 'daily',
            token: 'valid-token',
        };

        const result = await service.subscribe(dto);

        expect(mockPrisma.subscription.findFirst).toHaveBeenCalledWith({
            where: { email: dto.email },
        });
        expect(mockPrisma.subscription.create).toHaveBeenCalled();
        expect(mockMail.sendConfirmation).toHaveBeenCalled();
        expect(result).toEqual({
            statusCode: 200,
            message: 'Subscription successful. Confirmation email sent.',
        });
    });

    it('should throw ConflictException if email already subscribed', async () => {
        mockPrisma.subscription.findFirst.mockResolvedValue({});

        await expect(
            service.subscribe({
                email: 'test@example.com',
                city: 'Kyiv',
                frequency: 'daily',
                token: 'valid-token',
            }),
        ).rejects.toThrow(ConflictException);
    });

    it('should confirm subscription', async () => {
        const token = 'valid-token';
        mockPrisma.subscription.findUnique.mockResolvedValue({ token });
        mockPrisma.subscription.update.mockResolvedValue({ confirmed: true });

        const result = await service.confirm(token);

        expect(mockPrisma.subscription.findUnique).toHaveBeenCalledWith({
            where: { token },
        });
        expect(mockPrisma.subscription.update).toHaveBeenCalledWith({
            where: { token },
            data: { confirmed: true },
        });
        expect(result).toEqual({ confirmed: true });
    });

    it('should throw NotFoundException for unknown confirm token', async () => {
        mockPrisma.subscription.findUnique.mockResolvedValue(null);

        await expect(service.confirm('unknown')).rejects.toThrow(
            NotFoundException,
        );
    });

    it('should unsubscribe', async () => {
        const token = 'valid-token';
        mockPrisma.subscription.findUnique.mockResolvedValue({ token });
        mockPrisma.subscription.update.mockResolvedValue({ confirmed: false });

        const result = await service.unsubscribe(token);

        expect(mockPrisma.subscription.update).toHaveBeenCalledWith({
            where: { token },
            data: { confirmed: false },
        });
        expect(result).toEqual({ confirmed: false });
    });

    it('should throw BadRequestException if token is invalid', async () => {
        await expect(service.confirm('')).rejects.toThrow(BadRequestException);
        await expect(service.unsubscribe('')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('should throw NotFoundException if unsubscribe token not found', async () => {
        mockPrisma.subscription.findUnique.mockResolvedValue(null);

        await expect(service.unsubscribe('bad')).rejects.toThrow(
            NotFoundException,
        );
    });
});
