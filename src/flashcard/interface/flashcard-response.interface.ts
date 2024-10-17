export class FlashcardResponseInterface {
  id: string;
  studySetId?: string;
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
