import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoleEnum } from '../user-role.enum';
import { AuthProviderEnum } from '../auth-provider.enum';

export class SignupFacebookCredentialsDto {
  @IsNotEmpty()
  @IsString()
  facebookId: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  fullName: string;

  @IsNotEmpty({ message: 'Birthday is required' })
  @IsDateString({}, { message: 'Invalid date' })
  birthday: Date;

  @IsNotEmpty({ message: 'Avatar URL is required' })
  @IsString({ message: 'Avatar URL must be a string' })
  avatarUrl: string;

  @IsEnum(UserRoleEnum)
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRoleEnum;

  @IsEnum(AuthProviderEnum)
  @IsNotEmpty({ message: 'Provider is required' })
  provider: AuthProviderEnum;

  @IsNotEmpty({ message: 'AccessToken is required' })
  @IsString({ message: 'AccessToken must be a string' })
  accessToken: string;
}
