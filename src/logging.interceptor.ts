import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly consoleLog = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    this.consoleLog.log(`Incoming request: ${method} ${url}`);

    return next
      .handle()
      .pipe(
        tap(() =>
          this.consoleLog.log(
            `Response for ${method} ${url} took ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
