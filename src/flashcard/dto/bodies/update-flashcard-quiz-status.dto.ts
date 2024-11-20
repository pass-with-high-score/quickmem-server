import { IsEnum, IsNotEmpty } from 'class-validator';
import { QuizFlashcardStatusEnum } from '../../enums/quiz-flashcard-status.enum';

export class UpdateFlashcardQuizStatusDto {
  @IsNotEmpty()
  @IsEnum(QuizFlashcardStatusEnum)
  quizStatus: QuizFlashcardStatusEnum;
}
