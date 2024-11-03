export interface GetClassResponseInterface {
  id: string;
  title: string;
  joinToken: string;
  allowSetManagement: boolean;
  allowMemberManagement: boolean;
  description?: string;
  owner: {
    id: string;
    role: string;
    username: string;
    avatarUrl: string;
  };
  memberCount: number;
  studySetCount: number;
  folderCount: number;
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
