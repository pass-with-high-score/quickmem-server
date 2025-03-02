import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRoleEnum } from '../../enums/user-role.enum';

export class UpdateRoleDto {
  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  role: UserRoleEnum;
}
