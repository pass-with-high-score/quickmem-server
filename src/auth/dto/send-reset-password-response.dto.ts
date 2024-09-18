export class SendResetPasswordResponseDto {
  email: string;
  is_sent: boolean;
  reset_password_token: string;
  message: string;
}
