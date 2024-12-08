import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { AuthProviderEnum } from '../../enums/auth-provider.enum';
import { UserRoleEnum } from '../../enums/user-role.enum';

export class SignUpGoogleBodyDto {
  @IsEnum(AuthProviderEnum)
  provider: AuthProviderEnum;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  birthday: string;
  @IsUrl()
  @IsNotEmpty()
  avatarUrl: string;
  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  role: UserRoleEnum;
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @IsString()
  @IsNotEmpty()
  googleToken: string;
}
