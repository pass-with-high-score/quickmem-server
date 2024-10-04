import { Module } from '@nestjs/common';
import { FlashcardController } from './flashcard.controller';
import { FlashcardService } from './flashcard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardEntity } from './entities/flashcard.entity';
import { TagEntity } from './entities/tag.entity';
import { FlashcardRepository } from './flashcard.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlashcardEntity, TagEntity]),
  ],
  controllers: [FlashcardController],
  providers: [FlashcardService, FlashcardRepository],
})
export class FlashcardModule {}
