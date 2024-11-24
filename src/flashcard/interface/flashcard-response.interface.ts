export class FlashcardResponseInterface {
  id: string;
  studySetId?: string;
  isAIGenerated: boolean;
  term: string;
  definition: string;
  definitionImageURL?: string;
  hint?: string;
  explanation?: string;
  isStarred: boolean;
  rating?: string;
  flipStatus?: string;
  quizStatus?: string;
  trueFalseStatus?: string;
  writeStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}
