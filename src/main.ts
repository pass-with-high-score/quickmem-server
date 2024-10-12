import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as process from 'node:process';
import { LoggingInterceptor } from './logging.interceptor'; // Correct import statement

async function bootstrap() {
  const logger = new Logger('bootstrap');
  logger.log('Starting the application...');
  const app = await NestFactory.create(AppModule);

  logger.log('Application created, setting up configurations...');
  app.enableCors();

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Set to true if using HTTPS
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  const config = new DocumentBuilder()
    .setTitle('Task Management')
    .setDescription('The Task Management API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = process.env.PORT || 3000;
  logger.log(`About to start listening on port ${port}`);
  await app.listen(port);
}

bootstrap().then(() => {
  console.log('Application started');
});
