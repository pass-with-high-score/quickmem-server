import { Controller, Get, Header, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Header('Content-Type', 'text/html')
  getLandingPage(): string {
    return `
      <html>
        <head>
          <title>QuickMem App</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 800px;
              margin: 50px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1, h2 {
              color: #333;
            }
            p {
              font-size: 16px;
              color: #555;
            }
            .team {
              margin-top: 20px;
            }
            .team-member {
              margin-bottom: 10px;
            }
            .team-member strong {
              color: #007bff;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to QuickMem!</h1>
            <p>QuickMem is an innovative app designed to help you manage and memorize your study materials efficiently. Whether you're preparing for exams or just want to keep your knowledge sharp, QuickMem has the tools you need.</p>
            <h2>Project Purpose</h2>
            <p>The purpose of QuickMem is to provide a user-friendly platform for students and professionals to create, organize, and review flashcards. Our goal is to enhance learning efficiency and retention through spaced repetition and other proven study techniques.</p>
            <h2>Team Members</h2>
            <div class="team">
              <div class="team-member"><strong>Nguyễn Quang Minh</strong> - Team Leader</div>
              <div class="team-member"><strong>Hà Văn Đạo</strong> - Developer</div>
              <div class="team-member"><strong>Nguyễn Đình Thi</strong> - Developer</div>
              <div class="team-member"><strong>Nguyễn Văn Hải</strong> - Developer</div>
              <div class="team-member"><strong>Vũ Đức Huân</strong> - Developer</div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
