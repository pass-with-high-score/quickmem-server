import { GetAllStudySetResponseInterface } from '../../study-set/interfaces/get-all-study-set-response.interface';
import { GetFolderResponseInterface } from '../../folder/interfaces/get-folder-response.interface';

export interface GetClassResponseInterface {
  id: string;
  title: string;
  joinToken?: string;
  allowSetManagement?: boolean;
  allowMemberManagement?: boolean;
  isImported?: boolean;
  description?: string;
  isJoined?: boolean;
  owner: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  memberCount?: number;
  studySetCount?: number;
  folderCount?: number;
  members?: {
    id: string;
    username: string;
    avatarUrl: string;
    isOwner: boolean;
  }[];
  studySets?: GetAllStudySetResponseInterface[];
  folders?: GetFolderResponseInterface[];
  createdAt: Date;
  updatedAt: Date;
}
