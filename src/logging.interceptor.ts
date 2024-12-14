import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { logger } from './winston-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly consoleLog = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers, body } = request;
    const now = Date.now();

    const clientIp = headers['x-forwarded-for'] || request.ip;

    const requestLog = {
      timestamp: new Date().toISOString(),
      method,
      url,
      clientIp,
      headers: { ...headers },
      body: { ...body },
    };

    this.consoleLog.log(
      `Incoming Request: ${JSON.stringify(requestLog, null, 2)}`,
    );
    logger.info(`Incoming Request: ${JSON.stringify(requestLog)}`);

    return next.handle().pipe(
      tap(() => {
        const httpResponse = context.switchToHttp().getResponse();
        const statusCode = httpResponse.statusCode;
        const responseLog = {
          timestamp: new Date().toISOString(),
          method,
          url,
          clientIp,
          statusCode,
          responseTime: `${Date.now() - now}ms`,
        };

        this.consoleLog.log(
          `Response Sent: ${JSON.stringify(responseLog, null, 2)}`,
        );
        logger.info(`Response Sent: ${JSON.stringify(responseLog)}`);
      }),
    );
  }
}
