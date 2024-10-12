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

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryProvider: CloudinaryProvider) {}

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
      return {
        message: 'Upload successful!',
        url: result.secure_url,
      };
    } catch (error) {
      return { message: 'Upload failed!', error };
    }
  }

  @Delete()
  async deleteImage(@Body('imageURL') imageURL: string) {
    try {
      const result = await this.cloudinaryProvider.deleteImage(imageURL);
      return {
        message: 'Delete successful!',
        result,
      };
    } catch (error) {
      return { message: 'Delete failed!', error };
    }
  }
}
