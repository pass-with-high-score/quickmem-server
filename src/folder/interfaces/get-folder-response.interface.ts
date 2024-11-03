import { GetAllStudySetResponseInterface } from '../../study-set/interfaces/get-all-study-set-response.interface';

export interface GetFolderResponseInterface {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  studySetCount: number;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
    role: string;
  };
  studySets: GetAllStudySetResponseInterface[];
  createdAt: Date;
  updatedAt: Date;
}
