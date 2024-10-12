import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { JoinClassByTokenParamDto } from './class/dto/params/join-class-by-token-param.dto';
import { Response } from 'express';
import { logger } from './winston-logger.service';

@UseInterceptors(LoggingInterceptor)
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
