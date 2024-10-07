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
  Query,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { StudySetService } from './study-set.service';
import { CreateStudySetDto } from './dto/create-study-set.dto';
import { CreateStudySetResponseInterface } from './dto/create-study-set-response.interface';
import { GetAllStudySetResponseInterface } from './dto/get-all-study-set-response.interface';
import { GetStudySetsByOwnerIdDto } from './dto/get-study-sets-by-ownerId.dto';
import { GetStudySetByIdDto } from './dto/get-study-set-by-id.dto';
import { UpdateStudySetByIdParamDto } from './dto/update-study-set-by-id-param.dto';
import { UpdateStudySetByIdBodyDto } from './dto/update-study-set-by-id-body.dto';
import { DeleteStudySetByIdParamDto } from './dto/delete-study-set-by-id-param.dto';
import { DeleteStudySetResponseInterface } from './dto/delete-study-set-response.interface';
import { DuplicateStudySetDto } from './dto/duplicate-study-set.dto';
import { DuplicateStudySetResponseInterface } from './dto/duplicate-study-set-response.interface';
import { SearchStudySetParamsDto } from './dto/search-study-set-params.dto';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('study-set')
export class StudySetController {
  constructor(private readonly studySetService: StudySetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStudySet(
    @Body() createStudySetDto: CreateStudySetDto,
  ): Promise<CreateStudySetResponseInterface> {
    console.log('createStudySetDto', createStudySetDto);
    return await this.studySetService.createStudySet(createStudySetDto);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async searchStudySetByTitle(
    @Query() searchStudySeParamsDto: SearchStudySetParamsDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    console.log('searchStudySeParamsDto', searchStudySeParamsDto);
    return await this.studySetService.searchStudySetByTitle(
      searchStudySeParamsDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getStudySets(): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetService.getStudySets();
  }

  @Get('/owner/:ownerId')
  @HttpCode(HttpStatus.OK)
  async getStudySetsByOwnerId(
    @Param() getStudySetsByOwnerIdDto: GetStudySetsByOwnerIdDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    return await this.studySetService.getStudySetsByOwnerId(
      getStudySetsByOwnerIdDto,
    );
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getStudySetById(
    @Param() getStudySetByIdDto: GetStudySetByIdDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return await this.studySetService.getStudySetById(getStudySetByIdDto);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async updateStudySetById(
    @Param() updateStudySetByIdParamDto: UpdateStudySetByIdParamDto,
    @Body() updateStudySetByIdBodyDto: UpdateStudySetByIdBodyDto,
  ): Promise<GetAllStudySetResponseInterface> {
    return await this.studySetService.updateStudySetById(
      updateStudySetByIdParamDto,
      updateStudySetByIdBodyDto,
    );
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK) // can change to 204 (No Content) but it will not return any response
  async deleteStudySetById(
    @Param() deleteStudySetByIdParamDto: DeleteStudySetByIdParamDto,
  ): Promise<DeleteStudySetResponseInterface> {
    return await this.studySetService.deleteStudySetById(
      deleteStudySetByIdParamDto,
    );
  }

  @Post('/duplicate')
  @HttpCode(HttpStatus.CREATED)
  async duplicateStudySet(
    @Body() duplicateStudySet: DuplicateStudySetDto,
  ): Promise<DuplicateStudySetResponseInterface> {
    return await this.studySetService.duplicateStudySet(duplicateStudySet);
  }
}
