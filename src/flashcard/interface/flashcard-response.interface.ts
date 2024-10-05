export class FlashcardResponseInterface {
  id: string;
  term: string;
  definition: string;
  definitionImageURL?: string;
  hint?: string;
  explanation?: string;
  isStarred: boolean;
  rating?: string;
  createdAt: Date;
  updatedAt: Date;
}
