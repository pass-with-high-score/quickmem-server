import { Controller, UseGuards, UseInterceptors, Post, Body, Get, Param, HttpException, HttpStatus, HttpCode, Patch } from '@nestjs/common';
import { ReportService } from './report.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CreateReportDto } from './dto/bodies/create-report.dto';
import { ReportResponseInterface } from './interfaces/report-response.interface';
import { ReportStatus } from './enums/report-status.enum';

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

  @Get('all')
  async getAllReports(): Promise<ReportResponseInterface[]> {
    try {
      return await this.reportService.findAllReports();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getReportById(@Param('id') id: number): Promise<ReportResponseInterface> {
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

  @Patch(':id/status/in-progress')
  async setInProgress(@Param('id') id: number): Promise<ReportResponseInterface> {
    try {
      return this.reportService.updateReportStatus(id, ReportStatus.IN_PROGRESS);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id/status/resolved')
  async setResolved(@Param('id') id: number): Promise<ReportResponseInterface> {
    try {
      return this.reportService.updateReportStatus(id, ReportStatus.RESOLVED);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id/status/closed')
  async setClosed(@Param('id') id: number): Promise<ReportResponseInterface> {
    try {
      return this.reportService.updateReportStatus(id, ReportStatus.CLOSED);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}