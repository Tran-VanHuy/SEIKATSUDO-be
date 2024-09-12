import { LoggerService } from '@nestjs/common';

export class CloudLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    this.printLog('INFO', message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.printLog('ERROR', message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.printLog('WARNING', message, optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.printLog('DEBUG', message, optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {}

  private printLog(severity: string, message: any, optionalParams: any[]) {
    const logObject = {
      severity,
      message: this.extractLogMessage(message, optionalParams),
    };
    console.log(JSON.stringify(logObject));
  }

  private extractLogMessage(message: any, optionalParams: any[]): string {
    const messageString = typeof message === 'string' ? message : JSON.stringify(message);
    const optionalParamsString = optionalParams
      .map((param) => {
        if (!!param?.stack) {
          return String(param.stack);
        }
        return typeof param === 'string' ? param : JSON.stringify(param);
      })
      .join(' ');
    return [messageString, optionalParamsString].join(' - ');
  }
}
