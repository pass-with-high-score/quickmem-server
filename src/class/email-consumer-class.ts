import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('send-email-class')
export class EmailConsumerClass {
  constructor(private readonly mailService: MailerService) {}

  @Process('send-invite-join-class')
  async sendInviteJoinClassEmail(job: Job<any>) {
    const { data } = job;
    console.log('Sending invite to join class email to', data);

    try {
      await this.mailService.sendMail({
        to: data.email,
        from: data.from,
        subject: 'You have been invited to join a class!',
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">Hello there,</h2>
          <p style="font-size: 16px; color: #555;">
            You have been invited to join a class on QuickMem. Select the button below to join the class and start learning!
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a 
              href="${process.env.HOST}/class/join/${data.joinToken}" 
              style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">
              Join class
            </a>
          </div>
          <p style="font-size: 16px; color: #555;">
            If you did not request to join this class, please ignore this email.
          </p>
          <p style="font-size: 16px; color: #555;">
            Learn on!
          </p>
          <p style="font-size: 16px; color: #555;">
            The QuickMem Team
          </p>
        </div>
      </div>
      `,
      });

      console.log('Invite to join class email sent successfully');
    } catch (error) {
      console.error('Error sending invite to join class email:', error);
    }
  }
}
