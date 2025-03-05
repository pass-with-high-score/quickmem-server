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
  Request,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CreateReportDto } from './dto/bodies/create-report.dto';
import { ReportResponseInterface } from './interfaces/report-response.interface';
import { UpdateStatusParamDto } from './dto/params/update-status-param.dto';
import { UpdateStatusDto } from './dto/bodies/update-status.dto';
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

  @Get('/reporter')
  @HttpCode(HttpStatus.OK)
  async getReportsByReporter(
    @Request() req,
  ): Promise<ReportResponseInterface[]> {
    const userId = req.user.id;
    return await this.reportService.getReportsByReporter(userId);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getReportById(
    @Param() updateStatusParamDto: UpdateStatusParamDto,
  ): Promise<ReportResponseInterface> {
    return await this.reportService.getReportById(updateStatusParamDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReport(
    @Request() req,
    @Body() createReportDto: CreateReportDto,
  ): Promise<ReportResponseInterface> {
    const userId = req.user.id;
    return await this.reportService.createReport(createReportDto, userId);
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
