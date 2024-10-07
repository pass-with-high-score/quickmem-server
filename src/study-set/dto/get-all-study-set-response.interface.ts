import { FlashcardResponseInterface } from '../../flashcard/interface/flashcard-response.interface';

export interface GetAllStudySetResponseInterface {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  flashCardCount: number;
  flashcards: FlashcardResponseInterface[];
  subject?: {
    id: number;
    name: string;
  };
  user: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  color?: {
    id: number;
    name: string;
    hexValue: string;
  };
}
