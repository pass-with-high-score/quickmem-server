import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CreateFlashcardDto } from './dto/bodies/create-flashcard.dto';
import { FlashcardResponseInterface } from './interface/flashcard-response.interface';
import { GetFlashcardByIdDto } from './dto/params/get-flashcard-by-id.dto';
import { GetFlashcardsByStudySetIdDto } from './dto/params/get-flashcards-by-study-set-id.dto';
import { DeleteFlashcardParamDto } from './dto/params/delete-flashcard-param.dto';
import { UpdateFlashcardParamDto } from './dto/params/update-flashcard-param.dto';
import { UpdateFlashcardDto } from './dto/bodies/update-flashcard.dto';
import { FlashcardEntity } from './entities/flashcard.entity';
import { UpdateFlashcardRatingDto } from './dto/bodies/update-flashcard-rating.dto';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('flashcard')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashcardService) {}

  @Get('/:id')
  async getFlashcardById(
    @Param() getFlashcardByIdDto: GetFlashcardByIdDto,
  ): Promise<FlashcardResponseInterface> {
    return this.flashcardService.getFlashcardById(getFlashcardByIdDto);
  }

  @Get('/study-set/:id')
  async getFlashcardByStudySetId(
    @Param() getFlashcardsByStudySetIdDto: GetFlashcardsByStudySetIdDto,
  ): Promise<FlashcardResponseInterface[]> {
    return this.flashcardService.getFlashcardByStudySetId(
      getFlashcardsByStudySetIdDto,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFlashcard(
    @Body() createFlashcardDto: CreateFlashcardDto,
  ): Promise<FlashcardResponseInterface> {
    console.log('createFlashcardDto', createFlashcardDto);
    return await this.flashcardService.createFlashcard(createFlashcardDto);
  }

  @Delete('/:id')
  async deleteFlashcardById(
    @Param() deleteFlashcardParamDto: DeleteFlashcardParamDto,
  ): Promise<void> {
    return this.flashcardService.deleteFlashcardById(deleteFlashcardParamDto);
  }

  @Put('/:id')
  async updateFlashcardById(
    @Param() updateFlashcardParamDto: UpdateFlashcardParamDto,
    @Body() updateFlashcardDto: UpdateFlashcardDto,
  ): Promise<FlashcardEntity> {
    return this.flashcardService.updateFlashcardById(
      updateFlashcardParamDto,
      updateFlashcardDto,
    );
  }

  @Patch('/:id/rating')
  async updateFlashcardRating(
    @Param() updateFlashcardParamDto: UpdateFlashcardParamDto,
    @Body() updateFlashcardRatingDto: UpdateFlashcardRatingDto,
  ): Promise<FlashcardEntity> {
    return this.flashcardService.updateFlashcardRating(
      updateFlashcardParamDto,
      updateFlashcardRatingDto,
    );
  }
}
