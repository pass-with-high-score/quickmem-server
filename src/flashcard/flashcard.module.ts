import { Module } from '@nestjs/common';
import { FlashcardController } from './flashcard.controller';
import { FlashcardService } from './flashcard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardEntity } from './flashcard.entity';
import { OptionEntity } from './option.entity';
import { TagEntity } from './tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlashcardEntity, OptionEntity, TagEntity]),
  ],
  controllers: [FlashcardController],
  providers: [FlashcardService],
})
export class FlashcardModule {}
