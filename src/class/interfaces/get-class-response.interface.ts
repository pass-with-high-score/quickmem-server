export interface GetClassResponseInterface {
  id: string;
  title: string;
  description?: string;
  owner: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  members: {
    id: string;
    username: string;
    avatarUrl: string;
  }[];
  studySets: {
    id: string;
    title: string;
    flashcardCount: number;
    owner: {
      id: string;
      username: string;
      avatarUrl: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }[];
  folders: {
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
    createdAt: Date;
    updatedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
