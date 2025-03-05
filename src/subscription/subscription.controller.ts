import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { CreateSubscriptionDto } from './dto/bodies/create-subscription.dto';
import { SubscriptionInterface } from './interfaces/subscription.interface';
import { UpdateSubscriptionTypeParamDto } from './dto/params/update-subscription-type.param.dto';
import { UpdateSubscriptionBodyDto } from './dto/bodies/update-subscription.body.dto';
import { UpdateAutoRenewParamDto } from './dto/params/update-auto-renew.param.dto';
import { UpdateAutoRenewBodyDto } from './dto/bodies/update-auto-renew.body.dto';
import { GetSubscriptionByIdParamDto } from './dto/params/get-subscription-by-id.param.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('subscription')
@UseInterceptors(CacheInterceptor)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getSubscriptionById(
    @Param() getSubscriptionByIdParamDto: GetSubscriptionByIdParamDto,
  ): Promise<SubscriptionInterface> {
    return this.subscriptionService.getSubscriptionById(
      getSubscriptionByIdParamDto,
    );
  }

  @Get('/user')
  @HttpCode(HttpStatus.OK)
  async getSubscriptionsByUserId(
    @Request() req,
  ): Promise<SubscriptionInterface[]> {
    const userId = req.user.id;
    return this.subscriptionService.getSubscriptionsByUserId(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSubscription(
    @Request() req,
    @Body() createSubscription: CreateSubscriptionDto,
  ): Promise<SubscriptionInterface> {
    const userId = req.user.id;
    return this.subscriptionService.createSubscription(
      createSubscription,
      userId,
    );
  }

  @Patch('/:id/auto-renew')
  @HttpCode(HttpStatus.OK)
  async updateAutoRenewStatus(
    @Param() updateAutoRenewParamDto: UpdateAutoRenewParamDto,
    @Body() updateAutoRenewBodyDto: UpdateAutoRenewBodyDto,
  ): Promise<SubscriptionInterface> {
    return this.subscriptionService.updateAutoRenewStatus(
      updateAutoRenewParamDto,
      updateAutoRenewBodyDto,
    );
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateSubscription(
    @Param() updateSubscriptionTypeParamDto: UpdateSubscriptionTypeParamDto,
    @Body() updateSubscriptionBodyDto: UpdateSubscriptionBodyDto,
  ): Promise<SubscriptionInterface> {
    return this.subscriptionService.updateSubscription(
      updateSubscriptionTypeParamDto,
      updateSubscriptionBodyDto,
    );
  }
}
