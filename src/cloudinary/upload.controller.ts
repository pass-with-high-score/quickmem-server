import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryProvider } from './cloudinary.provider';
import { multerConfig } from './multer.config';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { ImageService } from './image.service';
import { DeleteImageDto } from './dto/bodies/delete-image.dto';
import { AuthService } from '../auth/auth.service';
import { UpdateAvatarDto } from '../auth/dto/bodies/update-avatar.dto';
import { Request as ReqUser } from '@nestjs/common/decorators/http/route-params.decorator';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('upload')
export class UploadController {
  constructor(
    private readonly cloudinaryProvider: CloudinaryProvider,
    private readonly imageService: ImageService,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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

  @Post('/avatar/:userId')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('avatar', { ...multerConfig, limits: { files: 1 } }),
  ) // Limit to 1 file
  async uploadAvatar(
    @ReqUser() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file || !file.buffer) {
        throw new BadRequestException('Empty file');
      }
      const result = await this.cloudinaryProvider.uploadAvatar(file);
      const body: UpdateAvatarDto = {
        avatar: result.url,
      };
      const userId = req.user.id;
      await this.authService.updateAvatar(userId, body);
      return {
        message: 'Upload successful!',
        url: result.url,
      };
    } catch (error) {
      return { message: 'Upload failed!', error };
    }
  }

  @Post('/default')
  @HttpCode(HttpStatus.CREATED)
  async createDefaultImage(): Promise<any> {
    return this.imageService.createDefaultImage();
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

  @Post('/change-user-avatar')
  @HttpCode(HttpStatus.CREATED)
  async changeUserAvatar(): Promise<void> {
    return await this.imageService.changeUserAvatar();
  }

  @Delete('/unused')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUnusedImages() {
    try {
      await this.imageService.deleteUnusedImages();
      return { message: 'Delete successful!' };
    } catch (error) {
      return { message: 'Delete failed!', error };
    }
  }
}
