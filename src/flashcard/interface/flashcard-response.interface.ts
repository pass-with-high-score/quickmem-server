export class FlashcardResponseInterface {
  id: string;
  question: string;
  questionImageURL?: string[];
  answer: string;
  answerImageURL?: string[];
  hint?: string;
  explanation?: string;
  rating?: string;
  createdAt: Date;
  updatedAt: Date;
}
