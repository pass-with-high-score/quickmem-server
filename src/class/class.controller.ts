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
  Request,
  UseGuards,
  UseInterceptors,
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
import { SearchClassesByTitleQueryDto } from './dto/queries/search-classes-by-title-query.dto';
import { JoinClassByTokenDto } from './dto/bodies/join-class-by-token.dto';
import { ExitClassDto } from './dto/bodies/exit-class.dto';
import { UpdateFoldersInClassDto } from './dto/bodies/update-folders-in-class.dto';
import { UpdateStudySetsInClassDto } from './dto/bodies/update-study-sets-in-class.dto';
import { RemoveMembersFromClassDto } from './dto/bodies/remove-members-from-class.dto';
import { UpdateItemInClassResponseInterface } from './interfaces/update-item-in-class-response.interface';
import { GetClassByUserIdQueryDto } from './dto/queries/get-class-by-user-Id-query.dto';
import { GetClassByJoinTokenParamDto } from './dto/params/get-class-by-join-token.param.dto';
import { RemoveStudySetByClassIdBodyDto } from './dto/bodies/remove-study-set-by-class-id-body.dto';
import { RemoveFolderByClassIdBodyDto } from './dto/bodies/remove-folder-by-class-id-body.dto';
import { UpdateRecentClassParamDto } from './dto/params/update-recent-class.param.dto';
import { InviteUserJoinClassBodyDto } from './dto/bodies/invite-user-join-class-body.dto';
import { InviteUserJoinClassResponseInterface } from './interfaces/invite-user-join-class-response.interface';
import { CacheInterceptor } from '@nestjs/cache-manager';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CacheInterceptor)
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/token/:joinToken')
  @HttpCode(HttpStatus.OK)
  async getClassByJoinToken(
    @Request() req,
    @Param() getClassByJoinTokenParamDto: GetClassByJoinTokenParamDto,
  ): Promise<GetClassResponseInterface> {
    const userId = req.user.id;
    return this.classService.getClassByJoinToken(
      getClassByJoinTokenParamDto,
      userId,
    );
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async searchClassByTitle(
    @Query() searchClassesByTitleQueryDto: SearchClassesByTitleQueryDto,
  ): Promise<GetClassResponseInterface[]> {
    return this.classService.searchClassByTitle(searchClassesByTitleQueryDto);
  }

  @Get('/recent')
  @HttpCode(HttpStatus.OK)
  async getRecentClassesByUserId(
    @Request() req,
  ): Promise<GetClassResponseInterface[]> {
    const userId = req.user.id;
    return this.classService.getRecentClassesByUserId(userId);
  }

  @Get('/user')
  @HttpCode(HttpStatus.OK)
  async getClassesByUserId(
    @Request() req,
    @Query() getClassByUserIdQueryDto: GetClassByUserIdQueryDto,
  ): Promise<GetClassResponseInterface[]> {
    const userId = req.user.id;
    return this.classService.getClassesByUserId(
      userId,
      getClassByUserIdQueryDto,
    );
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getClassById(
    @Param() getClassByIdParamDto: GetClassByIdParamDto,
  ): Promise<GetClassResponseInterface> {
    return this.classService.getClassById(getClassByIdParamDto);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateClass(
    @Request() req,
    @Param() updateClassByIdParamDto: UpdateClassByIdParamDto,
    @Body() updateClassByIdDto: UpdateClassByIdDto,
  ): Promise<CreateClassResponseInterface> {
    const ownerId = req.user.id;
    return this.classService.updateClass(
      updateClassByIdParamDto,
      updateClassByIdDto,
      ownerId,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createClass(
    @Request() req,
    @Body() createClassDto: CreateClassDto,
  ): Promise<CreateClassResponseInterface> {
    const ownerId = req.user.id;
    return this.classService.createClass(createClassDto, ownerId);
  }

  @Post('/join')
  @HttpCode(HttpStatus.OK)
  async joinClassByJoinToken(
    @Request() req,
    @Body() joinClassByTokenDto: JoinClassByTokenDto,
  ): Promise<UpdateItemInClassResponseInterface> {
    const userId = req.user.id;
    return this.classService.joinClassByJoinToken(joinClassByTokenDto, userId);
  }

  @Post('/exit')
  @HttpCode(HttpStatus.NO_CONTENT)
  async exitClass(
    @Request() req,
    @Body() exitClassDto: ExitClassDto,
  ): Promise<void> {
    const userId = req.user.id;
    return this.classService.exitClass(exitClassDto, userId);
  }

  @Post('/folders')
  @HttpCode(HttpStatus.CREATED)
  async updateClassFolders(
    @Request() req,
    @Body() updateFoldersInClassDto: UpdateFoldersInClassDto,
  ): Promise<UpdateItemInClassResponseInterface> {
    const userId = req.user.id;
    return this.classService.updateClassFolders(
      updateFoldersInClassDto,
      userId,
    );
  }

  @Post('/remove-folder')
  @HttpCode(HttpStatus.OK)
  async removeFolderByClassId(
    @Request() req,
    @Body() removeFolderByClassIdBodyDto: RemoveFolderByClassIdBodyDto,
  ): Promise<GetClassResponseInterface> {
    const userId = req.user.id;
    return this.classService.removeFolderByClassId(
      removeFolderByClassIdBodyDto,
      userId,
    );
  }

  @Post('/study-sets')
  @HttpCode(HttpStatus.CREATED)
  async updateStudySetsInClass(
    @Request() req,
    @Body() updateStudySetsInClassDto: UpdateStudySetsInClassDto,
  ): Promise<UpdateItemInClassResponseInterface> {
    const userId = req.user.id;
    return this.classService.updateStudySetsInClass(
      updateStudySetsInClassDto,
      userId,
    );
  }

  @Post('/remove-study-set')
  @HttpCode(HttpStatus.OK)
  async removeStudySetByClassId(
    @Request() req,
    @Body() removeStudySetByClassIdBodyDto: RemoveStudySetByClassIdBodyDto,
  ): Promise<GetClassResponseInterface> {
    const userId = req.user.id;
    return this.classService.removeStudySetByClassId(
      removeStudySetByClassIdBodyDto,
      userId,
    );
  }

  @Post('/members')
  @HttpCode(HttpStatus.CREATED)
  async removeMembersFromClass(
    @Request() req,
    @Body() removeMembersFromClassDto: RemoveMembersFromClassDto,
  ): Promise<GetClassResponseInterface> {
    const userId = req.user.id;
    return this.classService.removeMembersFromClass(
      removeMembersFromClassDto,
      userId,
    );
  }

  @Post('/recent/:id')
  @HttpCode(HttpStatus.CREATED)
  async updateRecentClass(
    @Request() req,
    @Param() updateRecentClassBodyDto: UpdateRecentClassParamDto,
  ) {
    const userId = req.user.id;
    return this.classService.updateRecentClass(
      updateRecentClassBodyDto,
      userId,
    );
  }

  @Post('/invite')
  @HttpCode(HttpStatus.CREATED)
  async inviteUserJoinClass(
    @Body() inviteUserJoinClassBodyDto: InviteUserJoinClassBodyDto,
  ): Promise<InviteUserJoinClassResponseInterface> {
    return this.classService.inviteUserJoinClass(inviteUserJoinClassBodyDto);
  }

  @Delete('/user')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAndExitAllClassesOfUser(@Request() req): Promise<void> {
    const userId = req.user.id;
    return this.classService.deleteAndExitAllClassesOfUser(userId);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteClassById(
    @Param() deleteClassByIdParamDto: DeleteClassByIdParamDto,
  ): Promise<void> {
    return this.classService.deleteClassById(deleteClassByIdParamDto);
  }
}
