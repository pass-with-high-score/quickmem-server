import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from './entities/image.entity';
import { CloudinaryProvider } from './cloudinary.provider';
import { logger } from '../winston-logger.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DefaultImageEntity } from '../auth/entities/default-image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly cloudinaryProvider: CloudinaryProvider,
    @InjectRepository(DefaultImageEntity)
    private readonly defaultImageRepository: Repository<DefaultImageEntity>,
  ) {}

  async createImage(data: { url: string }): Promise<ImageEntity> {
    const image = this.imageRepository.create(data);
    return this.imageRepository.save(image);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async deleteUnusedImages(): Promise<void> {
    try {
      logger.info('Deleting unused images every 30 minutes');
      const images = await this.imageRepository.find({
        relations: ['flashcard'],
      });
      const imageUrls = images.map((image) => {
        // only return image url if image.flashcard is null
        if (!image.flashcard) {
          return image.url;
        }
      });
      const cloudinaryImages = await this.cloudinaryProvider.getAllImages();

      const cloudinaryImageUrls = cloudinaryImages.resources.map(
        (cloudinaryImage: { secure_url: any }) => cloudinaryImage.secure_url,
      );

      const unusedImages = imageUrls.filter(
        (imageUrl) => !cloudinaryImageUrls.includes(imageUrl),
      );

      await Promise.all(
        unusedImages.map((unusedImageUrl) =>
          this.deleteImageByUrl(unusedImageUrl),
        ),
      );
    } catch (error) {
      console.log('Error deleting unused images:', error);
      logger.error('Error deleting unused images:', error);
    }
  }

  async deleteImageByUrl(imageURL: string): Promise<void> {
    if (!imageURL) {
      return;
    }
    const image = await this.imageRepository.findOne({
      where: { url: imageURL },
    });
    if (image) {
      await this.cloudinaryProvider.deleteImage(imageURL);
      await this.imageRepository.remove(image);
    }
  }

  async createDefaultImage(): Promise<any> {
    const images = await this.cloudinaryProvider.getAllImageInFolder('avatars');
    for (const image of images.resources) {
      console.log('image', image);
      const avatar = new DefaultImageEntity();
      avatar.url = image.secure_url;
      await this.defaultImageRepository.save(avatar);
    }
  }
}
