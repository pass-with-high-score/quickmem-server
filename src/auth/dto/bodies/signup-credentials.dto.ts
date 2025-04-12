import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuthProviderEnum } from '../../enums/auth-provider.enum';
import { IsStrictGmail } from '../utils/is-strict-gmail.validator';

export class SignupCredentialsDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsStrictGmail({
    message: 'Invalid Gmail/Google email. Aliases or tricks are not allowed.',
  })
  email: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @MaxLength(32, { message: 'Username must be at most 32 characters long' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
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

  @IsEnum(AuthProviderEnum)
  @IsNotEmpty({ message: 'Provider is required' })
  provider: AuthProviderEnum;
}
