import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { ImageRepository } from './image.repository';
import { ImageService } from './image.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ImageEntity]),
    ScheduleModule.forRoot(),
  ],
  controllers: [UploadController],
  providers: [CloudinaryProvider, ImageRepository, ImageService],
})
export class UploadModule {}
