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
import { JoinClassByLinkParamDto } from './study-set/dto/params/join-class-by-link-param.dto';
import { JoinFolderByLinkParamDto } from './folder/dto/params/join-folder-by-link-param.dto';

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

  @Get('/study-set/share/:studySetLinkCode')
  @HttpCode(HttpStatus.OK)
  async shareStudySet(
    @Param() studySetLinkCode: JoinClassByLinkParamDto,
    @Res() response: Response,
  ): Promise<void> {
    // Create deep link for study set
    logger.info(
      `Sharing study set with code: ${studySetLinkCode.studySetLinkCode}`,
    );
    const deepLinkUrl = `quickmem://share/study-set?code=${studySetLinkCode.studySetLinkCode}`;
    logger.info(`Deep link URL: ${deepLinkUrl}`);

    // Create HTML content
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Share Study Set</title>
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
        .study-set-name {
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
        <h1>Share Study Set Invitation</h1>
        <p>You are invited to access the study set:</p>
        <div class="study-set-name">QuickMem - Advanced Flashcards</div>

        <p>Click the button below to view and study this set of flashcards.</p>
        
        <a href="${deepLinkUrl}" class="btn">Access Study Set</a>

        <div class="footer">
          <p>Need help? Contact support for assistance.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send HTML as response
    response.status(HttpStatus.OK).send(htmlContent);
  }

  @Get('/folder/share/:folderLinkCode')
  @HttpCode(HttpStatus.OK)
  async shareFolder(
    @Param() folderLinkCode: JoinFolderByLinkParamDto,
    @Res() response: Response,
  ): Promise<void> {
    // Create deep link for the folder
    logger.info(`Sharing folder with code: ${folderLinkCode.folderLinkCode}`);
    const deepLinkUrl = `quickmem://share/folder?code=${folderLinkCode.folderLinkCode}`;
    logger.info(`Deep link URL: ${deepLinkUrl}`);

    // Create HTML content
    const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Share Folder</title>
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
      .folder-name {
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
      <h1>Share Folder Invitation</h1>
      <p>You are invited to access the folder:</p>
      <div class="folder-name">QuickMem - Study Folder</div>

      <p>Click the button below to view and explore the contents of this folder.</p>
      
      <a href="${deepLinkUrl}" class="btn">Access Folder</a>

      <div class="footer">
        <p>Need help? Contact support for assistance.</p>
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
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickMem App - Enhance Your Learning</title>
    <meta name="description" content="QuickMem is a flashcard-based learning application designed to help students improve their memorization skills through spaced repetition techniques.">
    <meta name="keywords" content="QuickMem, flashcards, learning app, spaced repetition, study materials">
    <meta name="author" content="Nguyễn Quang Minh">
    <style>
        :root {
            --primary-color: #4a90e2;
            --secondary-color: #f39c12;
            --text-color: #333;
            --bg-color: #f9f9f9;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--bg-color);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background-color: var(--primary-color);
            color: white;
            padding: 1rem 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        header.scrolled {
            padding: 0.5rem 0;
            background-color: rgba(74, 144, 226, 0.9);
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            margin-left: 20px;
            transition: opacity 0.3s ease;
        }
        
        .nav-links a:hover {
            opacity: 0.8;
        }
        
        main {
            padding: 6rem 0 3rem;
        }
        
        h1, h2 {
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        p {
            margin-bottom: 1rem;
        }
        
        .features, .technologies, .team {
            background-color: white;
            border-radius: 8px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .features.visible, .technologies.visible, .team.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .features ul, .technologies ul {
            list-style-type: none;
            padding-left: 0;
        }
        
        .features li, .technologies li {
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;
        }
        
        .features li:before, .technologies li:before {
            content: '✓';
            color: var(--secondary-color);
            position: absolute;
            left: 0;
        }
        
        .team-members {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .team-member {
            background-color: #f0f0f0;
            border-radius: 8px;
            padding: 1rem;
            width: calc(33.333% - 1rem);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }
        
        .team-member:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }
        
        .team-member img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-bottom: 0.5rem;
            transition: transform 0.3s ease;
        }
        
        .team-member:hover img {
            transform: scale(1.1);
        }
        
        .demo-video {
            aspect-ratio: 16 / 9;
            width: 100%;
        }
        
        .cta-button {
            display: inline-block;
            background-color: var(--secondary-color);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            margin-top: 1rem;
            text-decoration: none;
            font-weight: bold;
            transition: background-color 0.3s ease, transform 0.3s ease;
        }
        
        .cta-button:hover {
            background-color: #e67e22;
            transform: scale(1.05);
        }
        
        footer {
            background-color: #333;
            color: white;
            text-align: center;
            padding: 1rem 0;
            margin-top: 3rem;
        }
        
        footer a {
            color: var(--secondary-color);
        }
        
        @media (max-width: 768px) {
            .team-member {
                width: calc(50% - 1rem);
            }
        }
        
        @media (max-width: 480px) {
            .team-member {
                width: 100%;
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        #hero {
            animation: fadeInUp 1s ease-out;
        }
    </style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">QuickMem</div>
            <div class="nav-links">
                <a href="#features">Features</a>
                <a href="#technologies">Technologies</a>
                <a href="#team">Team</a>
                <a href="#contact">Contact</a>
            </div>
        </nav>
    </header>

    <main class="container">
        <section id="hero">
            <h1>Welcome to QuickMem!</h1>
            <p>QuickMem is an innovative app designed to help you manage and memorize your study materials efficiently. Whether you're preparing for exams or just want to keep your knowledge sharp, QuickMem has the tools you need.</p>
            <a href="https://github.com/pass-with-high-score" class="cta-button">Get Started</a>
        </section>

        <section id="features" class="features">
            <h2>Features</h2>
            <ul>
                <li>Create and organize flashcards easily</li>
                <li>Track your progress with detailed statistics</li>
                <li>Use spaced repetition to improve learning retention</li>
                <li>Collaborate with classmates and share study sets</li>
                <li>Accessible on multiple devices</li>
            </ul>
        </section>

        <section id="technologies" class="technologies">
            <h2>Technologies Used</h2>
            <ul>
                <li><strong>Backend:</strong> NestJS</li>
                <li><strong>Frontend:</strong> Jetpack Compose (Android)</li>
                <li><strong>Database:</strong> PostgreSQL (Supabase)</li>
                <li><strong>CI/CD:</strong> GitHub Actions</li>
                <li><strong>Version Control:</strong> Git & GitHub</li>
            </ul>
        </section>

        <section id="team" class="team">
            <h2>Meet Our Team</h2>
            <div class="team-members">
                <a href="https://github.com/nqmgaming" target="_blank" class="team-member">
                    <img src="https://github.com/nqmgaming.png" alt="Nguyễn Quang Minh">
                    <h3>Nguyễn Quang Minh</h3>
                    <p>Team Leader</p>
                </a>
                <a href="https://github.com/VawnDao" target="_blank" class="team-member">
                    <img src="https://github.com/VawnDao.png" alt="Hà Văn Đạo">
                    <h3>Hà Văn Đạo</h3>
                    <p>Developer</p>
                </a>
                <a href="https://github.com/thinguyendinh04" target="_blank" class="team-member">
                    <img src="https://github.com/thinguyendinh04.png" alt="Nguyễn Đình Thi">
                    <h3>Nguyễn Đình Thi</h3>
                    <p>Developer</p>
                </a>
                <a href="https://github.com/vanhai7868" target="_blank" class="team-member">
                    <img src="https://github.com/vanhai7868.png" alt="Nguyễn Văn Hải">
                    <h3>Nguyễn Văn Hải</h3>
                    <p>Developer</p>
                </a>
                <a href="https://github.com/VuDucHuan2811" target="_blank" class="team-member">
                    <img src="https://github.com/VuDucHuan2811.png" alt="Vũ Đức Huân">
                    <h3>Vũ Đức Huân</h3>
                    <p>Developer</p>
                </a>
                <a href="https://github.com/nguyenVu401" target="_blank" class="team-member">
                    <img src="https://github.com/nguyenVu401.png" alt="Vũ Hữu Nguyên">
                    <h3>Vũ Hữu Nguyên</h3>
                    <p>Developer</p>
                </a>
            </div>
        </section>

        <section id="demo">
            <h2>App Demo</h2>
            <iframe class="demo-video" src="https://www.youtube.com/embed/rCFmLjGq3Jg" frameborder="0" allowfullscreen></iframe>
        </section>

        <section id="contact">
            <h2>Contact Us</h2>
            <p>If you have any questions or would like to contribute to the project, feel free to contact us:</p>
            <ul>
                <li>Email: <a href="mailto:support@quickmem.app">support@quickmem.app</a></li>
                <li>GitHub Issues: <a href="https://github.com/pass-with-high-score/quick_mem/issues" target="_blank">Report an issue</a></li>
            </ul>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 QuickMem. All rights reserved.</p>
            <p>Source code: <a href="https://github.com/pass-with-high-score" target="_blank">https://github.com/pass-with-high-score</a></p>
        </div>
    </footer>

    <script>
        // Scroll animation for header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            header.classList.toggle('scrolled', window.scrollY > 10);
        });

        // Fade-in animation for sections
        const sections = document.querySelectorAll('.features, .technologies, .team');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            observer.observe(section);
        });
    </script>
</body>
</html>
    `;
  }
}
