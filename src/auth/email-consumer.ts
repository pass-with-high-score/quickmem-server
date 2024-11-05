import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { MailOtpInterface } from './interfaces/mail-otp.interface';
import { MailLoginInterface } from './interfaces/mail-login.interface';
import { MailSignupInterface } from './interfaces/mail-signup.interface';
import { MailResetPasswordInterface } from './interfaces/mail-reset-password.interface';
import { MailResetPasswordSuccessInterface } from './interfaces/mail-reset-password-success.interface';
import { MailUpdatePasswordSuccessInterface } from './interfaces/mail-update-password-successs.interface';

@Processor('send-email')
export class EmailConsumer {
  constructor(private readonly mailService: MailerService) {}

  @Process('send-otp-email')
  async transcode(job: Job<MailOtpInterface>) {
    const { data } = job;
    console.log('Sending email to', data);

    try {
      await this.mailService.sendMail({
        to: data.email,
        from: data.from,
        subject: 'Your OTP Code',
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div
          style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello, ${data.fullName}</h2>
          <p style="font-size: 16px; color: #555;">
            Welcome to QuickMem! To complete your verification process, please use the OTP code below.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 2px;">${data.otp}</p>
          </div>
          <p style="font-size: 16px; color: #555;">
            This OTP is valid for <strong>10 minutes</strong>. Please enter it before the time expires.
          </p>
          <p style="font-size: 14px; color: #999;">
            If you did not request this code, please ignore this email or contact our support team if you have any concerns.
          </p>
        </div>
        <div style="max-width: 600px; margin: 20px auto; text-align: center; font-size: 12px; color: #999;">
          <p>© 2024 QuickMem. All rights reserved.</p>
        </div>
      </div>
      `,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  @Process('send-login-email')
  async sendLoginEmail(job: Job<MailLoginInterface>) {
    const { data } = job;
    console.log('Sending email to', data);

    try {
      await this.mailService.sendMail({
        to: data.email,
        from: data.from,
        subject: 'Login Notification',
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello, ${data.fullName}</h2>
          <p style="font-size: 16px; color: #555;">
            You have successfully logged in to your QuickMem account.
          </p>
          <p style="font-size: 14px; color: #999;">
            If you did not log in, please contact our support team immediately.
          </p>
        </div>
        <div style="max-width: 600px; margin: 20px auto; text-align: center; font-size: 12px; color: #999;">
          <p>© 2024 QuickMem. All rights reserved.</p>
        </div>
      </div>
      `,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  @Process('send-signup-email')
  async sendSignupEmail(job: Job<MailSignupInterface>) {
    const { data } = job;
    console.log('Sending email to', data);

    try {
      await this.mailService.sendMail({
        to: data.email,
        from: data.from,
        subject: 'Welcome to QuickMem!',
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello, ${data.fullName}</h2>
          <p style="font-size: 16px; color: #555;">
            Welcome to QuickMem! You have successfully created an account.
          </p>
          <p style="font-size: 14px; color: #999;">
            If you did not create an account, please contact our support team immediately.
          </p>
        </div>
        <div style="max-width: 600px; margin: 20px auto; text-align: center; font-size: 12px; color: #999;">
          <p>© 2024 QuickMem. All rights reserved.</p>
        </div>
      </div>
      `,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  @Process('send-reset-password-email')
  async sendResetPasswordEmail(job: Job<MailResetPasswordInterface>) {
    const { data } = job;
    console.log('Sending email to', data);

    try {
      await this.mailService.sendMail({
        to: data.email,
        from: data.from,
        subject: 'Reset Password Request',
        html: `
       <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Password Reset OTP</h2>
          <p style="font-size: 16px; color: #555;">
            To reset your password, please use the OTP code below.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 2px;">${data.otp}</p>
          </div>
          <p style="font-size: 16px; color: #555;">
            This OTP is valid for <strong>10 minutes</strong>. Please enter it before the time expires.
          </p>
          <p style="font-size: 14px; color: #999;">
            If you did not request this code, please ignore this email or contact our support team if you have any concerns.
          </p>
        </div>
        <div style="max-width: 600px; margin: 20px auto; text-align: center; font-size: 12px; color: #999;">
          <p>© 2024 QuickMem. All rights reserved.</p>
        </div>
      </div>
      `,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  @Process('reset-password-success')
  async sendResetPasswordSuccessEmail(
    job: Job<MailResetPasswordSuccessInterface>,
  ) {
    const { data } = job;
    console.log('Sending email to', data);

    try {
      await this.mailService.sendMail({
        to: data.email,
        from: data.from,
        subject: 'Password Reset Successful',
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Password Reset Successful</h2>
          <p style="font-size: 16px; color: #555;">
            Your password has been successfully reset. If you did not make this change, please contact our support team immediately.
          </p>
        </div>
        <div style="max-width: 600px; margin: 20px auto; text-align: center; font-size: 12px; color: #999;">
          <p>© 2024 QuickMem. All rights reserved.</p>
        </div>
      </div>
      `,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  @Process('update-password-success')
  async sendUpdatePasswordSuccessEmail(
    job: Job<MailUpdatePasswordSuccessInterface>,
  ) {
    const { data } = job;
    console.log('Sending email to', data);

    try {
      await this.mailService.sendMail({
        to: data.email,
        from: data.from,
        subject: 'Password Update Successful',
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello, ${data.fullName}</h2>
          <p style="font-size: 16px; color: #555;">
            Your password has been successfully updated. If you did not make this change, please contact our support team immediately.
          </p>
        </div>
        <div style="max-width: 600px; margin: 20px auto; text-align: center; font-size: 12px; color: #999;">
          <p>© 2024 QuickMem. All rights reserved.</p>
        </div>
      </div>
      `,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  @Process('send-verification-email')
  async sendVerificationEmail(job: Job<any>) {
    const { data } = job;
    console.log('Sending verification email to', data);
    try {
      await this.mailService.sendMail({
        to: data.email,
        from: data.from,
        subject: 'Email Verification',
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div 
          style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello there,</h2>
          <p style="font-size: 16px; color: #555;">
            You recently changed the email address associated with your Quizlet account to ${data.email}. Select the button below to confirm your account and you'll be on your way!
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a 
              href="${process.env.HOST}/auth/verify-email?token=${data.tokenTempEmail}&userId=${data.userId}" 
              style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">
              Confirm new email
            </a>
          </div>
          <p style="font-size: 16px; color: #555;">
            If you did not change your email address, please contact Quizlet support.
          </p>
          <p style="font-size: 16px; color: #555;">
            Learn on!
          </p>
          <p style="font-size: 16px; color: #555;">
            The Quizlet Team
          </p>
        </div>
      </div>
      `,
      });
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }

  @Process('update-email-success')
  async sendVerificationEmailAfterUpdate(job: Job<any>) {
    const { data } = job;
    console.log('Sending verification emails to', data);

    try {
      // Send email to old address
      await this.mailService.sendMail({
        to: data.oldEmail,
        from: data.from,
        subject: 'Email Address Changed for Your Account',
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello ${data.userName},</h2>
          <p style="font-size: 16px; color: #555;">
            We wanted to let you know that the email address for your account has recently been changed. 
            Your account is no longer associated with this email (${data.oldEmail}).
          </p>
          <p style="font-size: 16px; color: #555;">
            If you did not authorize this change, please contact us immediately.
          </p>
          <p style="font-size: 16px; color: #555;">
            Regards, <br>The Quizlet Team
          </p>
        </div>
      </div>
      `,
      });

      // Send email to new address
      await this.mailService.sendMail({
        to: data.newEmail,
        from: data.from,
        subject: 'Welcome! Your Email Address Has Been Updated',
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello ${data.userName},</h2>
          <p style="font-size: 16px; color: #555;">
            Congratulations! Your account email has successfully been updated to ${data.newEmail}.
          </p>
          <p style="font-size: 16px; color: #555;">
            If this update was unintentional, please contact us as soon as possible for assistance.
          </p>
          <p style="font-size: 16px; color: #555;">
            Best regards, <br>The Quizlet Team
          </p>
        </div>
      </div>
      `,
      });

      console.log('Verification emails for email change sent successfully');
    } catch (error) {
      console.error('Error sending verification emails:', error);
    }
  }
}
