export interface CreateClassResponseInterface {
  id: string;
  title: string;
  description?: string;
  owner: string;
  allowSetAndMemberManagement: boolean;
  createdAt: Date;
  updatedAt: Date;
}
