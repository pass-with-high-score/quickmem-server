import { Module } from '@nestjs/common';
import { PixabayService } from './pixabay.service';
import { PixabayController } from './pixabay.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [PixabayService],
  controllers: [PixabayController],
})
export class PixabayModule {}
