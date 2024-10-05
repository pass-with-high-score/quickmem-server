import { Module } from '@nestjs/common';
import { FlashcardController } from './flashcard.controller';
import { FlashcardService } from './flashcard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashcardEntity } from './entities/flashcard.entity';
import { FlashcardRepository } from './flashcard.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FlashcardEntity])],
  controllers: [FlashcardController],
  providers: [FlashcardService, FlashcardRepository],
})
export class FlashcardModule {}
