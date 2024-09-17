import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  logger.log('Starting the application...');
  const app = await NestFactory.create(AppModule);

  logger.log('Application created, setting up configurations...');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Task Management')
    .setDescription('The Task Management API description')
    .setVersion('1.0')
    .addTag('tasks')
    .addTag('auth')
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

  const port = process.env.PORT || 3000;
  logger.log(`About to start listening on port ${port}`);
  await app.listen(port);
  logger.log(`Application is listening on port ${port}`);
}

bootstrap();
