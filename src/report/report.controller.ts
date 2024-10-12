import { Controller, UseInterceptors } from '@nestjs/common';
import { ReportService } from './report.service';
import { LoggingInterceptor } from '../logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
}
