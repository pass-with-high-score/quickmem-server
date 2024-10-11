import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { AuthProviderEnum } from '../../enums/auth-provider.enum';

export class SignupCredentialsDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @MaxLength(32, { message: 'Username must be at most 32 characters long' })
  username: string;

  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 8,
    },
    { message: 'Password is too weak' },
  )
  password: string;

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
}
