export interface CreateStudyTimeInterface {
  userId: string;
  studySetId: string;
  timeSpent: number;
  learnMode?: string;
  createdAt: Date;
  updatedAt: Date;
}
