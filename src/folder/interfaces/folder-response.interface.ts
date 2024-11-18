export interface FolderResponseInterface {
  id: string;
  title: string;
  linkShareCode: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
