import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { SwaggerTheme } from 'swagger-themes';
import { MyLogger } from './logger/services/my-logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Customizable logger
  app.useLogger(new MyLogger());

  // Set ValidationPipe globaly
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('self-checkout api')
    .setDescription('The self-checkout API description')
    .setVersion('1.0')
    .addTag('Stock', 'Endpoints related to Stock')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme('v3');

  const options = {
    explorer: true,
    customCss: theme.getBuffer('dark'),
  };
  SwaggerModule.setup('/swagger', app, document, options);
  await app.listen(3000);
}
bootstrap();
