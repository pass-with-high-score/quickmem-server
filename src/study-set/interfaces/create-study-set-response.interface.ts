export interface CreateStudySetResponseInterface {
  id: string;
  title: string;
  subjectId?: number;
  colorId?: number;
  isPublic: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
