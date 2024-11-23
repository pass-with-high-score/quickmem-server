import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { UserRoleEnum } from '../../enums/user-role.enum';

export class UpdateRoleDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  role: UserRoleEnum;
}
