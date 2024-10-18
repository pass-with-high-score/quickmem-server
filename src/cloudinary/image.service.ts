import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from './entities/image.entity';
import { CloudinaryProvider } from './cloudinary.provider';
import { logger } from '../winston-logger.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly cloudinaryProvider: CloudinaryProvider,
  ) {}

  async createImage(data: { url: string }): Promise<ImageEntity> {
    const image = this.imageRepository.create(data);
    return this.imageRepository.save(image);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async deleteUnusedImages(): Promise<void> {
    logger.info('Deleting unused images every 30 minutes');
    const images = await this.imageRepository.find({
      relations: ['flashcards'],
    });
    const unusedImages = images.filter(
      (image) => image.flashcards.length === 0,
    );

    for (const image of unusedImages) {
      logger.info(`Deleting image ${image.url}`);
      await this.cloudinaryProvider.deleteImage(image.url);
      await this.imageRepository.remove(image);
    }
  }

  async deleteImageByUrl(imageURL: string): Promise<void> {
    const image = await this.imageRepository.findOne({
      where: { url: imageURL },
    });
    if (image) {
      await this.imageRepository.remove(image);
    }
  }
}
