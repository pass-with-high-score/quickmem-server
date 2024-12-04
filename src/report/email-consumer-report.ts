import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('send-email-report')
export class EmailConsumerReport {
  constructor(private readonly mailService: MailerService) {}

  @Process('send-report-create')
  async sendReportEmail(job: Job<any>) {
    const { data } = job;
    console.log('Sending report email to', data.email);

    try {
      await this.mailService.sendMail({
        to: data.email,
        from: data.from,
        subject: data.subject,
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello ${data.reporter.username},</h2>
          <p style="font-size: 16px; color: #555;">
            Your report with the following reason has been successfully created:
          </p>
          <blockquote style="font-size: 16px; color: #007bff; margin: 20px 0;">
            "${data.reason}"
          </blockquote>
          <p style="font-size: 16px; color: #555;">
            Thank you for your feedback. Our team will review your report as soon as possible.
          </p>
          <p style="font-size: 16px; color: #555;">
            Best regards,
          </p>
          <p style="font-size: 16px; color: #555;">
            The QuickMem Team
          </p>
        </div>
      </div>
      `,
      });

      console.log('Report email sent successfully');
    } catch (error) {
      console.error('Error sending report email:', error);
    }
  }
}
