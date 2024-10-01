export class FlashcardResponseInterface {
  id: string;
  question: string;
  answer: string;
  imageURL?: string[];
  hint?: string;
  explanation?: string;
  rating?: string;
  options?: {
    answerText: string;
    isCorrect: boolean;
    imageURL: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}
