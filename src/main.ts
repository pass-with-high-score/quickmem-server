import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as process from 'node:process';
import { LoggingInterceptor } from './logging.interceptor';
import { useApitally } from 'apitally/nestjs';
import helmet from 'helmet';

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
      cookie: {
        secure: process.env.NODE_ENV === 'prod',
        httpOnly: true,
        sameSite: 'lax',
      },
    }),
  );

  app.use(
    helmet.hsts({
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true,
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

  useApitally(app, {
    clientId: process.env.APITALLY_CLIENT_ID,
    env: process.env.APITALLY_ENV,
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
