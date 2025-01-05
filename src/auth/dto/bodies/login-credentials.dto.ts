import { IsEmail, IsEnum, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { AuthProviderEnum } from '../../enums/auth-provider.enum';

export class LoginCredentialsDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    },
    { message: 'Password is too weak' },
  )
  password: string;

  @IsEnum(AuthProviderEnum)
  @IsNotEmpty({ message: 'Provider is required' })
  provider: AuthProviderEnum;
}
