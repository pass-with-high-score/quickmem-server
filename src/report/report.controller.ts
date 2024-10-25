import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  HttpException,
  HttpStatus,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CreateReportDto } from './dto/bodies/create-report.dto';
import { ReportResponseInterface } from './interfaces/report-response.interface';
import { UpdateStatusParamDto } from './dto/params/update-status-param.dto';
import { UpdateStatusDto } from './dto/bodies/update-status.dto';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReport(
    @Body() createReportDto: CreateReportDto,
  ): Promise<ReportResponseInterface> {
    try {
      return this.reportService.createReport(createReportDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllReports(): Promise<ReportResponseInterface[]> {
    try {
      return await this.reportService.findAllReports();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getReportById(
    @Param('id') id: string,
  ): Promise<ReportResponseInterface> {
    try {
      const report = await this.reportService.findReportById(id);
      if (!report) {
        throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
      }
      return report;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('reporter/:reporterId')
  @HttpCode(HttpStatus.OK)
  async getReportsByReporter(
    @Param('reporterId') reporterId: string,
  ): Promise<ReportResponseInterface[]> {
    try {
      return await this.reportService.findReportsByReporter(reporterId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/:id/status')
  async setResolved(
    @Param() updateStatusParamDto: UpdateStatusParamDto,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<ReportResponseInterface> {
    try {
      return this.reportService.updateReportStatus(
        updateStatusParamDto,
        updateStatusDto,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
