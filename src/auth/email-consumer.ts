import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { MailOtpInterface } from './dto/mail-otp.interface';

@Processor('send-email')
export class EmailConsumer {
  constructor(private readonly mailService: MailerService) {}

  @Process("send-otp-email")
  async transcode(job: Job<MailOtpInterface>) {
    const { data } = job;
    console.log('Sending email to', data);

    try {
      await this.mailService.sendMail({
        to: data.to,
        from: data.from,
        subject: 'Your OTP Code',
        html : `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div
          style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello, ${data.full_name}</h2>
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
      `
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
