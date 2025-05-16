import { GetAllStudySetResponseInterface } from '../../study-set/interfaces/get-all-study-set-response.interface';
import { GetFolderResponseInterface } from '../../folder/interfaces/get-folder-response.interface';

export interface UserDetailResponseInterface {
  id: string;
  username: string;
  fullname: string;
  avatarUrl: string;
  studySets: GetAllStudySetResponseInterface[];
  folders: GetFolderResponseInterface[];
}
