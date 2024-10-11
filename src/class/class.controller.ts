import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateClassResponseInterface } from './interfaces/create-class-response.interface';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { GetClassByIdParamDto } from './dto/get-class-by-id-param.dto';
import { GetClassResponseInterface } from './interfaces/get-class-response.interface';
import { UpdateClassByIdParamDto } from './dto/update-class-by-id-param.dto';
import { UpdateClassByIdDto } from './dto/update-class-by-id.dto';
import { DeleteClassByIdParamDto } from './dto/delete-class-by-id-param.dto';
import { GetClassesByUserIdDto } from './dto/get-classes-by-user-id.dto';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getClassById(
    @Param() getClassByIdParamDto: GetClassByIdParamDto,
  ): Promise<GetClassResponseInterface> {
    return this.classService.getClassById(getClassByIdParamDto);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  async getClassesByUserId(
    @Param() getClassesByUserIdDto: GetClassesByUserIdDto,
  ): Promise<GetClassResponseInterface[]> {
    return this.classService.getClassesByUserId(getClassesByUserIdDto);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateClass(
    @Param() updateClassByIdParamDto: UpdateClassByIdParamDto,
    @Body() updateClassByIdDto: UpdateClassByIdDto,
  ): Promise<CreateClassResponseInterface> {
    console.log('updateClassByIdParamDto', updateClassByIdParamDto);
    return this.classService.updateClass(
      updateClassByIdParamDto,
      updateClassByIdDto,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createClass(
    @Body() createClassDto: CreateClassDto,
  ): Promise<CreateClassResponseInterface> {
    return this.classService.createClass(createClassDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteClassById(
    @Param() deleteClassByIdParamDto: DeleteClassByIdParamDto,
  ): Promise<void> {
    return this.classService.deleteClassById(deleteClassByIdParamDto);
  }
}
