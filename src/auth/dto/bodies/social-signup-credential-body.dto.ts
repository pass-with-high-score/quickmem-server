import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { AuthProviderEnum } from '../../enums/auth-provider.enum';

export class SocialSignupCredentialBodyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  username: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsNotEmpty()
  @IsDateString()
  birthday: Date;

  @IsNotEmpty()
  @IsString()
  photoUrl: string;

  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  role: UserRoleEnum;

  @IsEnum(AuthProviderEnum)
  @IsNotEmpty()
  provider: AuthProviderEnum;

  @IsNotEmpty()
  @IsString()
  idToken: string;
}
