import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  customLog(text: string) {
    this.log('(CUSTOM)' + ' ' + text);
  }
}
