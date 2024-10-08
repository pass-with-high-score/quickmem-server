export interface GetFolderResponseInterface {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  studySetCount: number;
  ownerId: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
    role: string;
  };
  studySets: {
    id: string;
    title: string;
    flashcardCount: number;
    owner: {
      id: string;
      username: string;
      avatarUrl: string;
      role: string;
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}
