import { FlashcardResponseInterface } from '../../flashcard/interface/flashcard-response.interface';

export interface GetAllStudySetResponseInterface {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  ownerId: string;
  flashCardCount: number;
  linkShareCode: string;
  flashcards: FlashcardResponseInterface[];
  subject?: {
    id: number;
    name: string;
  };
  user: {
    id: string;
    username: string;
    avatarUrl: string;
    role: string;
  };
  color?: {
    id: number;
    name: string;
    hexValue: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
