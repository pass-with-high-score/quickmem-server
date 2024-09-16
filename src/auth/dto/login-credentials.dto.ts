import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginCredentialsDto {
  email: string;
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword(
    {
      minLength: 8,
    },
    { message: 'Password is too weak' },
  )
  password: string;
}
