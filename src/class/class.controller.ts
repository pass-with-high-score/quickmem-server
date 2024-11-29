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
import { SearchClassesByTitleQueryDto } from './dto/queries/search-classes-by-title-query.dto';
import { JoinClassByTokenDto } from './dto/bodies/join-class-by-token.dto';
import { ExitClassDto } from './dto/bodies/exit-class.dto';
import { UpdateFoldersInClassDto } from './dto/bodies/update-folders-in-class.dto';
import { UpdateStudySetsInClassDto } from './dto/bodies/update-study-sets-in-class.dto';
import { RemoveMembersFromClassDto } from './dto/bodies/remove-members-from-class.dto';
import { UpdateItemInClassResponseInterface } from './interfaces/update-item-in-class-response.interface';
import { GetClassByUserIdQueryDto } from './dto/queries/get-class-by-user-Id-query.dto';
import { GetClassByJoinTokenParamDto } from './dto/params/get-class-by-join-token.param.dto';
import { GetClassByJoinTokenQueryDto } from './dto/queries/get-class-by-join-token.query.dto';
import { RemoveStudySetByClassIdBodyDto } from './dto/bodies/remove-study-set-by-class-id-body.dto';
import { RemoveFolderByClassIdBodyDto } from './dto/bodies/remove-folder-by-class-id-body.dto';
import { UpdateRecentClassBodyDto } from './dto/bodies/update-recent-class-body.dto';
import { InviteUserJoinClassBodyDto } from './dto/bodies/invite-user-join-class-body.dto';
import { InviteUserJoinClassResponseInterface } from './interfaces/invite-user-join-class-response.interface';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/token/:joinToken')
  @HttpCode(HttpStatus.OK)
  async getClassByJoinToken(
    @Param() getClassByJoinTokenParamDto: GetClassByJoinTokenParamDto,
    @Query() getClassByJoinTokenQueryDto: GetClassByJoinTokenQueryDto,
  ): Promise<GetClassResponseInterface> {
    return this.classService.getClassByJoinToken(
      getClassByJoinTokenParamDto,
      getClassByJoinTokenQueryDto,
    );
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async searchClassByTitle(
    @Query() searchClassesByTitleQueryDto: SearchClassesByTitleQueryDto,
  ): Promise<GetClassResponseInterface[]> {
    return this.classService.searchClassByTitle(searchClassesByTitleQueryDto);
  }

  @Get('/recent/:userId')
  @HttpCode(HttpStatus.OK)
  async getRecentClassesByUserId(
    @Param() getClassesByUserIdDto: GetClassesByUserIdDto,
  ): Promise<GetClassResponseInterface[]> {
    return this.classService.getRecentClassesByUserId(getClassesByUserIdDto);
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
    @Query() getClassByUserIdQueryDto: GetClassByUserIdQueryDto,
  ): Promise<GetClassResponseInterface[]> {
    return this.classService.getClassesByUserId(
      getClassesByUserIdDto,
      getClassByUserIdQueryDto,
    );
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
  ): Promise<UpdateItemInClassResponseInterface> {
    return this.classService.joinClassByJoinToken(joinClassByTokenDto);
  }

  @Post('/exit')
  @HttpCode(HttpStatus.NO_CONTENT)
  async exitClass(@Body() exitClassDto: ExitClassDto): Promise<void> {
    return this.classService.exitClass(exitClassDto);
  }

  @Post('/folders')
  @HttpCode(HttpStatus.CREATED)
  async updateClassFolders(
    @Body() updateFoldersInClassDto: UpdateFoldersInClassDto,
  ): Promise<UpdateItemInClassResponseInterface> {
    return this.classService.updateClassFolders(updateFoldersInClassDto);
  }

  @Post('/remove-folder')
  @HttpCode(HttpStatus.OK)
  async removeFolderByClassId(
    @Body() removeFolderByClassIdBodyDto: RemoveFolderByClassIdBodyDto,
  ): Promise<GetClassResponseInterface> {
    return this.classService.removeFolderByClassId(
      removeFolderByClassIdBodyDto,
    );
  }

  @Post('/study-sets')
  @HttpCode(HttpStatus.CREATED)
  async updateStudySetsInClass(
    @Body() updateStudySetsInClassDto: UpdateStudySetsInClassDto,
  ): Promise<UpdateItemInClassResponseInterface> {
    return this.classService.updateStudySetsInClass(updateStudySetsInClassDto);
  }

  @Post('/remove-study-set')
  @HttpCode(HttpStatus.OK)
  async removeStudySetByClassId(
    @Body() removeStudySetByClassIdBodyDto: RemoveStudySetByClassIdBodyDto,
  ): Promise<GetClassResponseInterface> {
    return this.classService.removeStudySetByClassId(
      removeStudySetByClassIdBodyDto,
    );
  }

  @Post('/members')
  @HttpCode(HttpStatus.CREATED)
  async removeMembersFromClass(
    @Body() removeMembersFromClassDto: RemoveMembersFromClassDto,
  ): Promise<GetClassResponseInterface> {
    return this.classService.removeMembersFromClass(removeMembersFromClassDto);
  }

  @Post('/recent')
  @HttpCode(HttpStatus.CREATED)
  async updateRecentClass(
    @Body() updateRecentClassBodyDto: UpdateRecentClassBodyDto,
  ) {
    return this.classService.updateRecentClass(updateRecentClassBodyDto);
  }

  @Post('/invite')
  @HttpCode(HttpStatus.CREATED)
  async inviteUserJoinClass(
    @Body() inviteUserJoinClassBodyDto: InviteUserJoinClassBodyDto,
  ): Promise<InviteUserJoinClassResponseInterface> {
    return this.classService.inviteUserJoinClass(inviteUserJoinClassBodyDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteClassById(
    @Param() deleteClassByIdParamDto: DeleteClassByIdParamDto,
  ): Promise<void> {
    return this.classService.deleteClassById(deleteClassByIdParamDto);
  }
}
