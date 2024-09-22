export class SendResetPasswordResponseDto {
  email: string;
  isSent: boolean;
  resetPasswordToken: string;
  message: string;
}
