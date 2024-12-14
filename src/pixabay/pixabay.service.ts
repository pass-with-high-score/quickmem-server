// src/pixabay/pixabay.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { logger } from '../winston-logger.service';
import { SearchImageQueryDto } from './dto/search-image-query.dto';
import { lastValueFrom } from 'rxjs';
import { PixabayResponse } from './interfaces/pixabay-response.interface';
import { PixabayHit } from './interfaces/pixabay-hit.interface';

@Injectable()
export class PixabayService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async searchImages(
    searchImageQueryDto: SearchImageQueryDto,
  ): Promise<PixabayResponse> {
    const { query } = searchImageQueryDto;
    try {
      const response = await lastValueFrom(
        this.httpService.get(this.configService.get<string>('PIXABAY_URL'), {
          params: {
            key: this.configService.get<string>('PIXABAY_API_KEY'),
            q: query,
            safesearch: true,
            order: 'popular',
          },
        }),
      );

      const images: PixabayHit[] = response.data.hits.map((hit: any) => ({
        id: hit.id,
        imageUrl: hit.largeImageURL,
      }));

      return {
        total: response.data.total,
        totalHits: response.data.totalHits,
        images,
      };
    } catch (error) {
      logger.error(`Error fetching images from Pixabay: ${error}`);
      throw new Error('Error fetching images from Pixabay');
    }
  }
}
