import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../service/mail.service';
import { ConfigService } from '@nestjs/config';
import { WeatherService } from '../service/weather.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInfo } from '../model/user.info';
import { UserConfirmationDto } from '../model/user.confirmation.dto';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');
const sendMailMock = jest.fn();

(nodemailer.createTransport as jest.Mock).mockReturnValue({
    sendMail: sendMailMock,
});

describe('MailService', () => {
    let service: MailService;
    let configService: ConfigService;
    let weatherService: WeatherService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MailService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            if (key === 'EMAIL_ADDRESS')
                                return 'test@example.com';
                            if (key === 'EMAIL_PASSWORD') return 'password';
                            return null;
                        }),
                    },
                },
                {
                    provide: WeatherService,
                    useValue: {
                        getAndSaveForecast: jest.fn().mockResolvedValue({
                            temperature: 20,
                            humidity: 60,
                            description: 'Sunny',
                        }),
                    },
                },
                {
                    provide: PrismaService,
                    useValue: {
                        subscription: {
                            findMany: jest.fn().mockResolvedValue([
                                {
                                    email: 'user@example.com',
                                    city: 'London',
                                    frequency: 'daily',
                                    token: 'token123',
                                    confirmed: true,
                                },
                            ]),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<MailService>(MailService);
        configService = module.get<ConfigService>(ConfigService);
        weatherService = module.get<WeatherService>(WeatherService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('sendMailing', () => {
        it('should send email with weather data', async () => {
            const userInfo: UserInfo = {
                email: 'user@example.com',
                city: 'London',
                frequency: 'daily',
                token: 'token123',
            };

            await service.sendMailing(userInfo);

            expect(weatherService.getAndSaveForecast).toHaveBeenCalledWith(
                'London',
                'daily',
            );
            expect(sendMailMock).toHaveBeenCalled();
        });
    });

    describe('sendConfirmation', () => {
        it('should send confirmation email', async () => {
            const dto: UserConfirmationDto = {
                email: 'user@example.com',
                city: 'London',
                frequency: 'hourly',
            };
            const token = 'token123';

            await service.sendConfirmation(dto, token);

            expect(sendMailMock).toHaveBeenCalled();
            const emailArgs = sendMailMock.mock.calls[0][0];
            expect(emailArgs.to).toBe('user@example.com');
            expect(emailArgs.subject).toContain('Confirmation');
            expect(emailArgs.html).toContain(`confirm/${token}`);
        });
    });
});
