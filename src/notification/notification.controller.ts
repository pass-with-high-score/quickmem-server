import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MessagingService } from '../firebase/messaging.service';
import { NotificationService } from './notification.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { GetNotificationByIdParamDto } from './dto/params/get-notification-by-id-param.dto';
import { GetNotificationByIdResponseInterface } from './interfaces/get-notification-by-id-response.interface';
import { GetNotificationByUserIdParamDto } from './dto/params/get-notification-by-user-id-param.dto';
import { CreateNotificationBodyDto } from './dto/bodies/create-notification-body.dto';
import { CreateNotificationResponseInterface } from './interfaces/create-notification-response.interface';
import { UpdateIsReadBodyDto } from './dto/bodies/update-is-read-body.dto';
import { UpdateIsReadParamDto } from './dto/params/update-is-read-param.dto';
import { UpdateIsReadResponseInterface } from './interfaces/update-is-read-response.interface';
import { DeleteNotificationParamDto } from './dto/params/delete-notification-param.dto';
import { RegisterDeviceTokenBodyDto } from './dto/bodies/register-device-token-body.dto';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getNotificationById(
    @Param() getNotificationByIdParamDto: GetNotificationByIdParamDto,
  ): Promise<GetNotificationByIdResponseInterface> {
    return this.notificationService.getNotificationById(
      getNotificationByIdParamDto,
    );
  }

  @Get('/user/:id')
  @HttpCode(HttpStatus.OK)
  async getNotificationsByUserId(
    @Param() getNotificationByUserIdParamDto: GetNotificationByUserIdParamDto,
  ): Promise<GetNotificationByIdResponseInterface[]> {
    return this.notificationService.getNotificationsByUserId(
      getNotificationByUserIdParamDto,
    );
  }

  @Patch('/:id/read')
  @HttpCode(HttpStatus.OK)
  async markNotificationAsRead(
    @Body() updateIsReadBodyDto: UpdateIsReadBodyDto,
    @Param() updateIsReadParamDto: UpdateIsReadParamDto,
  ): Promise<UpdateIsReadResponseInterface> {
    return this.notificationService.markNotificationAsRead(
      updateIsReadBodyDto,
      updateIsReadParamDto,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNotification(
    @Body() createNotificationBodyDto: CreateNotificationBodyDto,
  ): Promise<CreateNotificationResponseInterface[]> {
    return this.notificationService.createNotification(
      createNotificationBodyDto,
    );
  }

  @Post('register')
  async registerDevice(
    @Body() registerDeviceTokenBodyDto: RegisterDeviceTokenBodyDto,
  ): Promise<void> {
    return this.messagingService.registerDeviceToken(
      registerDeviceTokenBodyDto.userId,
      registerDeviceTokenBodyDto.deviceToken,
    );
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNotification(
    @Param() deleteNotificationParamDto: DeleteNotificationParamDto,
  ): Promise<void> {
    return this.notificationService.deleteNotification(
      deleteNotificationParamDto,
    );
  }
}
