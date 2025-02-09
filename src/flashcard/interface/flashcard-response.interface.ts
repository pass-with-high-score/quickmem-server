export class FlashcardResponseInterface {
  id: string;
  studySetId?: string;
  isAIGenerated: boolean;
  term: string;
  termImageURL?: string;
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
  termVoiceCode?: string;
  definitionVoiceCode?: string;
  createdAt: Date;
  updatedAt: Date;
}
