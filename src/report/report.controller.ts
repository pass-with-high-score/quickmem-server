import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportService } from './report.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
}
