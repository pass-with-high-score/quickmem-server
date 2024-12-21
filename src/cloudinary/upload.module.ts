import { forwardRef, Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { ImageRepository } from './image.repository';
import { ImageService } from './image.service';
import { ScheduleModule } from '@nestjs/schedule';
import { DefaultImageEntity } from '../auth/entities/default-image.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([ImageEntity, DefaultImageEntity]),
    ScheduleModule.forRoot(),
  ],
  controllers: [UploadController],
  providers: [CloudinaryProvider, ImageRepository, ImageService],
  exports: [CloudinaryProvider],
})
export class UploadModule {}
