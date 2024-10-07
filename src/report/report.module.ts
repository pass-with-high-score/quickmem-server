import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from './entities/report.entity';
import { ReportRepository } from './report.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity])],
  providers: [ReportService, ReportRepository],
  controllers: [ReportController],
})
export class ReportModule {}
