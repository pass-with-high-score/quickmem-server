import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  HttpStatus,
  HttpCode,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CreateReportDto } from './dto/bodies/create-report.dto';
import { ReportResponseInterface } from './interfaces/report-response.interface';
import { UpdateStatusParamDto } from './dto/params/update-status-param.dto';
import { UpdateStatusDto } from './dto/bodies/update-status.dto';
import { GetReporterIdParamDto } from './dto/params/get-reporterId-param.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CacheInterceptor)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getReports(): Promise<ReportResponseInterface[]> {
    return await this.reportService.getReports();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getReportById(
    @Param() updateStatusParamDto: UpdateStatusParamDto,
  ): Promise<ReportResponseInterface> {
    return await this.reportService.getReportById(updateStatusParamDto);
  }

  @Get('/:id/reporter')
  @HttpCode(HttpStatus.OK)
  async getReportsByReporter(
    @Param() getReporterIdParamDto: GetReporterIdParamDto,
  ): Promise<ReportResponseInterface[]> {
    return await this.reportService.getReportsByReporter(getReporterIdParamDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReport(
    @Body() createReportDto: CreateReportDto,
  ): Promise<ReportResponseInterface> {
    return await this.reportService.createReport(createReportDto);
  }

  @Patch('/:id/status')
  async setResolved(
    @Param() updateStatusParamDto: UpdateStatusParamDto,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<ReportResponseInterface> {
    return await this.reportService.updateReportStatus(
      updateStatusParamDto,
      updateStatusDto,
    );
  }
}
