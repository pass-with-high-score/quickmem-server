import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { JoinClassByTokenParamDto } from './class/dto/params/join-class-by-token-param.dto';
import { Response } from 'express';
import { logger } from './winston-logger.service';

@Controller()
export class AppController {
  constructor() {}

  @Get('/class/join/:token')
  @HttpCode(HttpStatus.OK)
  async joinClassByJoinToken(
    @Param() joinClassByTokenDto: JoinClassByTokenParamDto,
    @Res() response: Response,
  ): Promise<void> {
    // create deep link
    logger.info(`Joining class by token: ${joinClassByTokenDto.token}`);
    const deepLinkUrl = `quickmem://join/class?code=${joinClassByTokenDto.token}`;
    logger.info(`Deep link URL: ${deepLinkUrl}`);

    // Return HTML invitation page
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Join Class Invitation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          text-align: center;
        }
        h1 {
          font-size: 24px;
          color: #333;
        }
        p {
          font-size: 16px;
          color: #555;
          margin-bottom: 20px;
        }
        .class-name {
          font-size: 18px;
          color: #007bff;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .btn {
          background-color: #007bff;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }
        .btn:hover {
          background-color: #0056b3;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>

      <div class="container">
        <h1>You're Invited to Join a Class!</h1>
        <p>You've been invited to join the class:</p>
        <div class="class-name">QuickMem - Advanced Study Group</div>

        <p>Click the button below to accept the invitation and join the class.</p>
        
        <a href="${deepLinkUrl}" class="btn">Join Class</a>

        <div class="footer">
          <p>Need help? Contact your teacher for assistance.</p>
        </div>
      </div>

    </body>
    </html>
  `;

    // Send HTML as response
    response.status(HttpStatus.OK).send(htmlContent);
  }

  @Get()
  @Header('Content-Type', 'text/html')
  getLandingPage(): string {
    return `
     <html>
  <head>
    <title>QuickMem App</title>
    <meta name="description" content="QuickMem is a flashcard-based learning application designed to help students improve their memorization skills through spaced repetition techniques.">
    <meta name="keywords" content="QuickMem, flashcards, learning app, spaced repetition, study materials">
    <meta name="author" content="Nguyễn Quang Minh">
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
      ul {
        list-style-type: none;
        padding: 0;
      }
      ul li {
        margin-bottom: 10px;
      }
      iframe {
        margin-top: 20px;
        width: 100%;
        height: 315px;
      }
      footer {
        text-align: center;
        margin-top: 40px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to QuickMem!</h1>
      <p>QuickMem is an innovative app designed to help you manage and memorize your study materials efficiently. Whether you're preparing for exams or just want to keep your knowledge sharp, QuickMem has the tools you need.</p>
      
      <h2>Project Purpose</h2>
      <p>The purpose of QuickMem is to provide a user-friendly platform for students and professionals to create, organize, and review flashcards. Our goal is to enhance learning efficiency and retention through spaced repetition and other proven study techniques.</p>
      
      <h2>Features</h2>
      <ul>
        <li>Create and organize flashcards easily.</li>
        <li>Track your progress with detailed statistics.</li>
        <li>Use spaced repetition to improve learning retention.</li>
        <li>Collaborate with classmates and share study sets.</li>
        <li>Accessible on multiple devices.</li>
      </ul>

      <h2>Technologies Used</h2>
      <ul>
        <li>Backend: <strong>NestJS</strong></li>
        <li>Frontend: <strong>Jetpack Compose (Android)</strong></li>
        <li>Database: <strong>PostgreSQL (Supabase)</strong></li>
        <li>CI/CD: <strong>GitHub Actions</strong></li>
        <li>Version Control: <strong>Git & GitHub</strong></li>
      </ul>

      <h2>Team Members</h2>
      <div class="team">
        <div class="team-member"><strong><a href="https://github.com/nqmgaming">Nguyễn Quang Minh</a></strong> - Team Leader</div>
        <div class="team-member"><strong><a href="https://github.com/daocon">Hà Văn Đạo</a></strong> - Developer</div>
        <div class="team-member"><strong><a href="https://github.com/thinguyendinh04">Nguyễn Đình Thi</a></strong> - Developer</div>
        <div class="team-member"><strong><a href="https://github.com/vuhai7868">Nguyễn Văn Hải</a></strong> - Developer</div>
        <div class="team-member"><strong><a href="https://github.com/VuDucHuan2811">Vũ Đức Huân</a></strong> - Developer</div>
        <div class="team-member"><strong><a href="https://github.com/nguyenVu401">Vũ Hữu Nguyên</a></strong> - Developer</div>
      </div>

      <h2>App Demo</h2>
      <iframe src="https://www.youtube.com/embed/rCFmLjGq3Jg" frameborder="0" allowfullscreen></iframe>

      <h2>Contact Us</h2>
      <p>If you have any questions or would like to contribute to the project, feel free to contact us:</p>
      <ul>
        <li>Email: <a href="mailto:support@quickmem.app">support@quickmem.app</a></li>
        <li>GitHub Issues: <a href="https://github.com/pass-with-high-score/quick_mem/issues" target="_blank">Report an issue</a></li>
      </ul>

      <footer>
        <p>&copy; 2024 QuickMem. All rights reserved.</p>
        <p>Source code: <a href="https://github.com/pass-with-high-score">https://github.com/pass-with-high-score</a></p>
      </footer>
    </div>
  </body>
</html>

    `;
  }
}
