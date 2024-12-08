import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('send-email-streak')
export class EmailConsumerStreak {
  constructor(private readonly mailService: MailerService) {}

  @Process('send-streak-reminder')
  async sendStreakReminderEmail(job: Job<any>) {
    const { data } = job;
    console.log('Sending streak reminder email to', data);

    try {
      await this.mailService.sendMail({
        to: data.email,
        from: data.from,
        subject: '🔥 Don’t Break Your Learning Streak!',
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center;">
          
          <h1 style="color: #ff6b6b;">🔥 Hi ${data.name}, Keep the Fire Going!</h1>
          <p style="font-size: 18px; color: #555; line-height: 1.8;">
            You’ve been doing an amazing job! 🌟 Don’t let your learning streak fade away. 
            Take a few minutes today and complete a quick study session to keep your streak alive. Every day counts! 💪
          </p>

          <img src="https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif" alt="Keep Going!" style="width: 100%; max-width: 400px; margin: 20px auto; border-radius: 8px;">

          <div style="margin: 25px 0;">
            <a 
              href="quickmem://open" 
              style="display: inline-block; padding: 15px 30px; background-color: #ff6b6b; color: #fff; font-size: 18px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              🚀 Open App & Learn Now!
            </a>
          </div>

          <p style="font-size: 16px; color: #555;">
            Remember, small steps every day lead to big achievements. You got this! 💪✨
          </p>

          <p style="font-size: 16px; color: #555; margin-top: 30px;">
            💡 Stay Curious, Keep Learning,  
            <br><strong>The QuickMem Team</strong>
          </p>
        </div>
      </div>
      `,
      });

      console.log('Streak reminder email sent successfully');
    } catch (error) {
      console.error('Error sending streak reminder email:', error);
    }
  }
}
