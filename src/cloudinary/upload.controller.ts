import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Delete,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryProvider } from './cloudinary.provider';
import { multerConfig } from './multer.config';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { ImageService } from './image.service';
import { DeleteImageDto } from './dto/bodies/delete-image.dto';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('upload')
export class UploadController {
  constructor(
    private readonly cloudinaryProvider: CloudinaryProvider,
    private readonly imageService: ImageService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('flashcard', { ...multerConfig, limits: { files: 1 } }),
  ) // Limit to 1 file
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file || !file.buffer) {
        throw new BadRequestException('Empty file');
      }
      const result = await this.cloudinaryProvider.uploadImage(file);
      const image = await this.imageService.createImage({ url: result.url });
      return {
        message: 'Upload successful!',
        url: image.url,
      };
    } catch (error) {
      return { message: 'Upload failed!', error };
    }
  }

  @Delete('/unused')
  async deleteUnusedImages() {
    try {
      await this.imageService.deleteUnusedImages();
      return { message: 'Delete successful!' };
    } catch (error) {
      return { message: 'Delete failed!', error };
    }
  }

  @Post('/delete')
  async deleteImage(@Body() deleteImageDto: DeleteImageDto) {
    const { imageURL } = deleteImageDto;
    try {
      const result = await this.cloudinaryProvider.deleteImage(imageURL);
      await this.imageService.deleteImageByUrl(imageURL);
      return {
        message: 'Delete successful!',
        result,
      };
    } catch (error) {
      return { message: 'Delete failed!', error };
    }
  }
}
