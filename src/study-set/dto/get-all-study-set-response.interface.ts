export interface GetAllStudySetResponseInterface {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  subject?: {
    id: number;
    name: string;
  };
  color?: {
    id: number;
    name: string;
    hexValue: string;
  };
}
