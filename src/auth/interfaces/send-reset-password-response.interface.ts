export interface SendResetPasswordResponseInterface {
  email: string;
  isSent: boolean;
  resetPasswordToken: string;
  message: string;
}
