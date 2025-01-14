import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { AuthProviderEnum } from '../../enums/auth-provider.enum';

export class LoginCredentialsDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(AuthProviderEnum)
  @IsNotEmpty({ message: 'Provider is required' })
  provider: AuthProviderEnum;
}
