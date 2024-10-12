export interface CreateClassResponseInterface {
  id: string;
  title: string;
  description?: string;
  owner: string;
  joinToken: string;
  allowSetManagement: boolean;
  allowMemberManagement: boolean;
  createdAt: Date;
  updatedAt: Date;
}
