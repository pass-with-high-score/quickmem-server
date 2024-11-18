export interface CreateStudySetResponseInterface {
  id: string;
  title: string;
  isAIGenerated: boolean;
  subjectId?: number;
  colorId?: number;
  isPublic: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
