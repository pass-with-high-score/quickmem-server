import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginCredentialsDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword(
    {
      minLength: 8,
    },
    { message: 'Password is too weak' },
  )
  password: string;
}
