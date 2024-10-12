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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/bodies/create-class.dto';
import { CreateClassResponseInterface } from './interfaces/create-class-response.interface';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { GetClassByIdParamDto } from './dto/params/get-class-by-id-param.dto';
import { GetClassResponseInterface } from './interfaces/get-class-response.interface';
import { UpdateClassByIdParamDto } from './dto/params/update-class-by-id-param.dto';
import { UpdateClassByIdDto } from './dto/bodies/update-class-by-id.dto';
import { DeleteClassByIdParamDto } from './dto/params/delete-class-by-id-param.dto';
import { GetClassesByUserIdDto } from './dto/params/get-classes-by-user-id.dto';
import { SearchClassByTitleDto } from './dto/queries/search-class-by-title.dto';
import { JoinClassByTokenDto } from './dto/bodies/join-class-by-token.dto';
import { ExitClassDto } from './dto/bodies/exit-class.dto';
import { AddFoldersToClassDto } from './dto/bodies/add-folders-to-class.dto';
import { RemoveFoldersFromClassDto } from './dto/bodies/remove-folders-from-class.dto';
import { AddStudySetsToClassDto } from './dto/bodies/add-study-sets-to-class.dto';
import { RemoveStudySetsFromClassDto } from './dto/bodies/remove-study-sets-from-class.dto';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async searchClassByTitle(
    @Query() searchClassByTitleDto: SearchClassByTitleDto,
  ): Promise<GetClassResponseInterface[]> {
    return this.classService.searchClassByTitle(searchClassByTitleDto);
  }

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

  @Post('/join')
  @HttpCode(HttpStatus.OK)
  async joinClassByJoinToken(
    @Body() joinClassByTokenDto: JoinClassByTokenDto,
  ): Promise<GetClassResponseInterface> {
    return this.classService.joinClassByJoinToken(joinClassByTokenDto);
  }

  @Post('/exit')
  @HttpCode(HttpStatus.NO_CONTENT)
  async exitClass(@Body() exitClassDto: ExitClassDto): Promise<void> {
    return this.classService.exitClass(exitClassDto);
  }

  @Post('/folders')
  @HttpCode(HttpStatus.CREATED)
  async addFoldersToClass(
    @Body() addFoldersToClassDto: AddFoldersToClassDto,
  ): Promise<GetClassResponseInterface> {
    return this.classService.addFoldersToClass(addFoldersToClassDto);
  }

  @Post('/study-sets')
  @HttpCode(HttpStatus.CREATED)
  async addStudySetsToClass(
    @Body() addStudySetsToClassDto: AddStudySetsToClassDto,
  ): Promise<GetClassResponseInterface> {
    return this.classService.addStudySetsToClass(addStudySetsToClassDto);
  }

  @Delete('/folders')
  @HttpCode(HttpStatus.OK)
  async removeFoldersFromClass(
    @Body() removeFoldersFromClassDto: RemoveFoldersFromClassDto,
  ): Promise<GetClassResponseInterface> {
    return this.classService.removeFoldersFromClass(removeFoldersFromClassDto);
  }

  @Delete('/study-sets')
  @HttpCode(HttpStatus.OK)
  async removeStudySetsFromClass(
    @Body() removeStudySetsFromClassDto: RemoveStudySetsFromClassDto,
  ): Promise<GetClassResponseInterface> {
    return this.classService.removeStudySetsFromClass(
      removeStudySetsFromClassDto,
    );
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteClassById(
    @Param() deleteClassByIdParamDto: DeleteClassByIdParamDto,
  ): Promise<void> {
    return this.classService.deleteClassById(deleteClassByIdParamDto);
  }
}
