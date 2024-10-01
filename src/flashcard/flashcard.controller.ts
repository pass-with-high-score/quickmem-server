import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { FlashcardResponseInterface } from './interface/flashcard-response.interface';
import { GetFlashcardByIdDto } from './dto/get-flashcard-by-id.dto';
import { GetFlashcardsByStudySetIdDto } from './dto/get-flashcards-by-study-set-id.dto';

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
}
