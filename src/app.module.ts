import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule as DefaultConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import configuration from './config/configuration';
import { Currency } from './entities/Currency';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthGuard } from './modules/auth/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { BlockedBillsModule } from './modules/blocked-bills/blocked.bills.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { StockModule } from './modules/stock/stock.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    StockModule,
    CheckoutModule,
    AuthModule,
    UsersModule,
    BlockedBillsModule,
    DefaultConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.string().default(3000),
        DB_NAME: Joi.string(),
        DB_USER: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_PORT: Joi.string().default(5432),
        DB_HOST: Joi.string(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Currency],
      // It shouldn't be used in prod, otherwise it can couse data loss.
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware);
  }
}
