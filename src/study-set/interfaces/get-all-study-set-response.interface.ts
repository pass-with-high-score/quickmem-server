import { FlashcardResponseInterface } from '../../flashcard/interface/flashcard-response.interface';

export interface GetAllStudySetResponseInterface {
  id: string;
  title: string;
  description?: string;
  isPublic?: boolean;
  flashcardCount?: number;
  isAIGenerated: boolean;
  linkShareCode?: string;
  isImported?: boolean;
  flashcards?: FlashcardResponseInterface[];
  subject?: {
    id: number;
    name: string;
  };
  owner: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  color?: {
    id: number;
    name: string;
    hexValue: string;
  };
  previousTermVoiceCode?: string;
  previousDefinitionVoiceCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
