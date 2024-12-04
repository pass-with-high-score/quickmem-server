import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from './entities/report.entity';
import { ReportRepository } from './report.repository';
import { BullModule } from '@nestjs/bull';
import { NotificationModule } from '../notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { EmailConsumerReport } from './email-consumer-report';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportEntity]),
    BullModule.registerQueue({
      name: 'send-email-report',
    }),
    ConfigModule,
    NotificationModule,
  ],
  providers: [ReportService, ReportRepository, EmailConsumerReport],
  controllers: [ReportController],
})
export class ReportModule {}
