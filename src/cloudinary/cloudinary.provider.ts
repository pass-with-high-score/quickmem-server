import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryProvider {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'flashcards',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        },
      );

      if (file.buffer) {
        uploadStream.end(file.buffer);
      } else {
        reject(new Error('Empty file buffer'));
      }
    });
  }

  async deleteImage(imageURL: string): Promise<any> {
    const publicId = imageURL.split('/').slice(-2).join('/').split('.')[0];
    return cloudinary.uploader.destroy(publicId);
  }

  async getAllImages(): Promise<any> {
    return cloudinary.api.resources({ type: 'upload', max_results: 500 });
  }
}
