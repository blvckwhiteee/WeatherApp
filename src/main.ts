import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(join(__dirname, '..', 'public'));

    const config = new DocumentBuilder()
        .setTitle('Weather API')
        .setDescription('API for weather and subscriptions')
        .setVersion('1.0')
        .addTag('weather')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();
