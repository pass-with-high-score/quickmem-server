import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { configValidationSchema } from './config.schema';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { FlashcardModule } from './flashcard/flashcard.module';
import { CardModule } from './card/card.module';
import { FolderModule } from './folder/folder.module';
import { ClassModule } from './class/class.module';
import { BullModule } from '@nestjs/bull';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get('MAILER_USER'),
            pass: configService.get('MAILER_PASS'),
          },
        },
        defaults: {},
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      renderPath: '/public',
    }),
    BullModule.forRoot({
      redis: {
        host: 'redis-17991.c16.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 17991,
        password: 'yEJcaGoUpGB1FKM9nrgSTvkXc6UKEPMs'
      },
    }),
    AuthModule,
    FlashcardModule,
    CardModule,
    FolderModule,
    ClassModule,
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class AppModule {}
