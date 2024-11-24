export interface UpdateFlashcardInterface {
  message: string;
  id: string;
  flipStatus?: string;
  rating?: string;
  isStarred?: boolean;
  quizStatus?: string;
  trueFalseStatus?: string;
  writeStatus?: string;
}
