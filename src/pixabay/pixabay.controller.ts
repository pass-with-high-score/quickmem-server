import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PixabayService } from './pixabay.service';
import { AuthGuard } from '@nestjs/passport';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { SearchImageQueryDto } from './dto/search-image-query.dto';

@Controller('pixabay')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CacheInterceptor)
export class PixabayController {
  constructor(private readonly pixabayService: PixabayService) {}

  @Get('search')
  async searchImages(@Query() searchImageQueryDto: SearchImageQueryDto) {
    return this.pixabayService.searchImages(searchImageQueryDto);
  }
}
