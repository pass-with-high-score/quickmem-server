import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { AuthProviderEnum } from '../../enums/auth-provider.enum';

export class LoginCredentialsDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 8,
    },
    { message: 'Password is too weak' },
  )
  password: string;

  @IsOptional()
  @IsString()
  idToken?: string;

  @IsEnum(AuthProviderEnum)
  @IsNotEmpty({ message: 'Provider is required' })
  provider: AuthProviderEnum;
}
