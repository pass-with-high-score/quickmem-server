import { GetAllStudySetResponseInterface } from '../../study-set/interfaces/get-all-study-set-response.interface';
import { GetFolderResponseInterface } from '../../folder/interfaces/get-folder-response.interface';
import { GetClassResponseInterface } from '../../class/interfaces/get-class-response.interface';

export interface UserDetailResponseInterface {
  id: string;
  username: string;
  fullname: string;
  avatarUrl: string;
  role: string;
  studySets: GetAllStudySetResponseInterface[];
  folders: GetFolderResponseInterface[];
  classes: GetClassResponseInterface[];
}
