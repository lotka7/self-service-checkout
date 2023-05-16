import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './errors/all-exception.filter';
import { MyLogger } from './logger/services/my-logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Customizable logger
  app.useLogger(new MyLogger());

  // Set general, base exception filter globaly
  app.useGlobalFilters(new AllExceptionsFilter(new HttpAdapterHost()));

  // Set ValidationPipe globaly
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
