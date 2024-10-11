export interface CreateStudySetResponseInterface {
  id: string;
  title: string;
  ownerId: string;
  subjectId?: number;
  colorId?: number;
  isPublic: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
