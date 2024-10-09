import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateClassResponseInterface } from './interfaces/create-class-response.interface';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createClass(
    @Body() createClassDto: CreateClassDto,
  ): Promise<CreateClassResponseInterface> {
    return this.classService.createClass(createClassDto);
  }
}
