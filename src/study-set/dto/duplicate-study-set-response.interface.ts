import { FlashcardResponseInterface } from '../../flashcard/interface/flashcard-response.interface';

export interface DuplicateStudySetResponseInterface {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  subjectId?: number;
  colorId?: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  flashcards: FlashcardResponseInterface[];
}
