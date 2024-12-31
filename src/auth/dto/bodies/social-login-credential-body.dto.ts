import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthProviderEnum } from '../../enums/auth-provider.enum';

export class SocialLoginCredentialBodyDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(AuthProviderEnum)
  provider: AuthProviderEnum;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsNotEmpty()
  @IsString()
  photoUrl: string;

  @IsString()
  @IsNotEmpty()
  idToken: string;
}
