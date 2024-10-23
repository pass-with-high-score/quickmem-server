import { Controller, UseGuards, UseInterceptors, Post, Body, Get, Param, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { ReportService } from './report.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CreateReportDto } from './dto/bodies/create-report.dto';
import { ReportResponseInterface } from './interfaces/report-response.interface';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReport(
    @Body() createReportDto: CreateReportDto
  ): Promise<ReportResponseInterface> {
    try {
      return this.reportService.createReport(createReportDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}