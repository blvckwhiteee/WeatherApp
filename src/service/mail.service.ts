import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { UserInfo } from '../model/user.info';
import { WeatherService } from './weather.service';
import { UserConfirmationDto } from '../model/user.confirmation.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { schedule } from 'node-cron';

@Injectable()
export class MailService implements OnModuleInit {
    private email: string;
    private transporter: nodemailer.Transporter;

    constructor(
        private configService: ConfigService,
        private readonly weatherService: WeatherService,
        private readonly prisma: PrismaService,
    ) {
        this.email = this.configService.get<string>('EMAIL_ADDRESS')!;
        const password = this.configService.get<string>('EMAIL_PASSWORD')!;

        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: this.email,
                pass: password,
            },
        });
    }

    async onModuleInit() {
        this.scheduleMailingTasks();
    }

    async sendMailing(mail: UserInfo) {
        const weather = await this.weatherService.getAndSaveForecast(
            mail.city,
            mail.frequency,
        );

        let frequency, temperatureText, humidityText;
        if (mail.frequency === 'daily') {
            frequency = 'Daily';
            temperatureText = 'Average daily temperature';
            humidityText = 'Average daily humidity';
        } else {
            frequency = 'Hourly';
            temperatureText = 'Current temperature';
            humidityText = 'Current humidity';
        }

        await this.transporter.sendMail({
            from: `"WeatherApp" <${this.email}>`,
            to: mail.email,
            subject: `${frequency} Weather Forecast`,
            html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px; color: #333;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 400px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <tr>  
                <td style="padding: 20px;">
                  <h2 style="color: #2a9d8f; margin-top: 0;">Weather forecast for ${mail.city}</h2>
                  <p><strong>${temperatureText}:</strong> ${weather.temperature}°C</p>
                  <p><strong>${humidityText}:</strong> ${weather.humidity}%</p>
                  <p><strong>Description:</strong> ${weather.description}</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://weatherapp-wbb3.onrender.com//api/unsubscribe/${mail.token}"
                       style="background-color: #2a9d8f; color: #ffffff; padding: 12px 24px; 
                       border-radius: 5px; text-decoration: none; display: inline-block; font-weight: bold;">
                      Unsubscribe from Weather Forecast Mailing
                    </a>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>`,
        });
    }

    async sendConfirmation(dto: UserConfirmationDto, token: string) {
        const frequency = dto.frequency === 'daily' ? 'Daily' : 'Hourly';
        await this.transporter.sendMail({
            from: `"WeatherApp" <${this.email}>`,
            to: dto.email,
            subject: 'Weather Forecast Confirmation',
            html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px; color: #333;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" 
                   style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 10px; 
                   box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #2a9d8f; margin-top: 0;">Confirm Your Weather Subscription</h2>
                  <p>
                    You’ve requested to subscribe to our <strong>${frequency} Weather Forecast</strong> newsletter.
                  </p>
                  <p>
                    To complete your registration, please confirm your subscription by clicking the button below.
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://weatherapp-wbb3.onrender.com//api/confirm/${token}"
                       style="background-color: #2a9d8f; color: #ffffff; padding: 12px 24px; 
                       border-radius: 5px; text-decoration: none; display: inline-block; font-weight: bold;">
                      Confirm Subscription
                    </a>
                  </div>
                  <p style="font-size: 14px; color: #666;">
                    If you did not request this subscription, please ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>`,
        });
    }

    private scheduleMailingTasks() {
        schedule('0 9 * * *', async () => {
            const dailyUsers = await this.prisma.subscription.findMany({
                where: { confirmed: true, frequency: 'daily' },
            });

            for (const user of dailyUsers) {
                if (!user.email || !user.city || !user.token) {
                    console.warn(
                        `Skipped invalid daily user: ${JSON.stringify(user)}`,
                    );
                    continue;
                }

                const mail = new UserInfo();
                mail.email = user.email;
                mail.city = user.city;
                mail.frequency = user.frequency;
                mail.token = user.token;

                await this.sendMailing(mail);
            }
        });

        schedule('5 * * * *', async () => {
            const hourlyUsers = await this.prisma.subscription.findMany({
                where: { confirmed: true, frequency: 'hourly' },
            });

            for (const user of hourlyUsers) {
                if (!user.email || !user.city || !user.token) {
                    console.warn(
                        `Skipped invalid hourly user: ${JSON.stringify(user)}`,
                    );
                    continue;
                }

                const mail = new UserInfo();
                mail.email = user.email;
                mail.city = user.city;
                mail.frequency = user.frequency;
                mail.token = user.token;

                await this.sendMailing(mail);
            }
        });
    }
}
