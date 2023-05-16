import { Module } from '@nestjs/common';
import { MyLogger } from './services/my-logger.service';

@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule {}
