import { Injectable } from '@nestjs/common';
import { ClassRepository } from './class.repository';
import { CreateClassDto } from './dto/bodies/create-class.dto';
import { CreateClassResponseInterface } from './interfaces/create-class-response.interface';
import { GetClassByIdParamDto } from './dto/params/get-class-by-id-param.dto';
import { GetClassResponseInterface } from './interfaces/get-class-response.interface';
import { UpdateClassByIdParamDto } from './dto/params/update-class-by-id-param.dto';
import { UpdateClassByIdDto } from './dto/bodies/update-class-by-id.dto';
import { DeleteClassByIdParamDto } from './dto/params/delete-class-by-id-param.dto';
import { SearchClassesByTitleQueryDto } from './dto/queries/search-classes-by-title-query.dto';
import { JoinClassByTokenDto } from './dto/bodies/join-class-by-token.dto';
import { ExitClassDto } from './dto/bodies/exit-class.dto';
import { UpdateStudySetsInClassDto } from './dto/bodies/update-study-sets-in-class.dto';
import { RemoveMembersFromClassDto } from './dto/bodies/remove-members-from-class.dto';
import { UpdateItemInClassResponseInterface } from './interfaces/update-item-in-class-response.interface';
import { UpdateFoldersInClassDto } from './dto/bodies/update-folders-in-class.dto';
import { GetClassByUserIdQueryDto } from './dto/queries/get-class-by-user-Id-query.dto';
import { GetClassByJoinTokenParamDto } from './dto/params/get-class-by-join-token.param.dto';
import { RemoveStudySetByClassIdBodyDto } from './dto/bodies/remove-study-set-by-class-id-body.dto';
import { RemoveFolderByClassIdBodyDto } from './dto/bodies/remove-folder-by-class-id-body.dto';
import { UpdateRecentClassParamDto } from './dto/params/update-recent-class.param.dto';
import { InviteUserJoinClassBodyDto } from './dto/bodies/invite-user-join-class-body.dto';
import { InviteUserJoinClassResponseInterface } from './interfaces/invite-user-join-class-response.interface';

@Injectable()
export class ClassService {
  constructor(private readonly classRepository: ClassRepository) {}

  async createClass(
    createClassDto: CreateClassDto,
    ownerId: string,
  ): Promise<CreateClassResponseInterface> {
    return this.classRepository.createClass(createClassDto, ownerId);
  }

  async getClassById(
    getClassByIdParamDto: GetClassByIdParamDto,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.getClassById(getClassByIdParamDto);
  }

  async getClassesByUserId(
    userId: string,
    getClassByUserIdQueryDto: GetClassByUserIdQueryDto,
  ): Promise<GetClassResponseInterface[]> {
    return this.classRepository.getClassesByUserId(
      userId,
      getClassByUserIdQueryDto,
    );
  }

  async updateClass(
    updateClassByIdParamDto: UpdateClassByIdParamDto,
    updateClassByIdDto: UpdateClassByIdDto,
    ownerId: string,
  ): Promise<CreateClassResponseInterface> {
    return this.classRepository.updateClass(
      updateClassByIdParamDto,
      updateClassByIdDto,
      ownerId,
    );
  }

  async deleteClassById(
    deleteClassByIdParamDto: DeleteClassByIdParamDto,
  ): Promise<void> {
    return this.classRepository.deleteClassById(deleteClassByIdParamDto);
  }

  async searchClassByTitle(
    searchClassesByTitleQueryDto: SearchClassesByTitleQueryDto,
  ): Promise<GetClassResponseInterface[]> {
    return this.classRepository.searchClassByTitle(
      searchClassesByTitleQueryDto,
    );
  }

  async joinClassByJoinToken(
    joinClassByTokenDto: JoinClassByTokenDto,
    userId: string,
  ): Promise<UpdateItemInClassResponseInterface> {
    return this.classRepository.joinClassByJoinToken(
      joinClassByTokenDto,
      userId,
    );
  }

  async exitClass(exitClassDto: ExitClassDto, userId: string): Promise<void> {
    return this.classRepository.exitClass(exitClassDto, userId);
  }

  async updateClassFolders(
    updateFoldersInClassDto: UpdateFoldersInClassDto,
    userId: string,
  ): Promise<UpdateItemInClassResponseInterface> {
    return this.classRepository.updateClassFolders(
      updateFoldersInClassDto,
      userId,
    );
  }

  async updateStudySetsInClass(
    updateStudySetsInClassDto: UpdateStudySetsInClassDto,
    userId: string,
  ): Promise<UpdateItemInClassResponseInterface> {
    return this.classRepository.updateStudySetsInClass(
      updateStudySetsInClassDto,
      userId,
    );
  }

  async removeMembersFromClass(
    removeMembersFromClassDto: RemoveMembersFromClassDto,
    userId: string,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.removeMembersFromClass(
      removeMembersFromClassDto,
      userId,
    );
  }

  async getClassByJoinToken(
    getClassByJoinTokenParamDto: GetClassByJoinTokenParamDto,
    userId: string,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.getClassByJoinToken(
      getClassByJoinTokenParamDto,
      userId,
    );
  }

  async removeStudySetByClassId(
    removeStudySetByClassIdBodyDto: RemoveStudySetByClassIdBodyDto,
    userId: string,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.removeStudySetByClassId(
      removeStudySetByClassIdBodyDto,
      userId,
    );
  }

  async removeFolderByClassId(
    removeFolderByClassIdBodyDto: RemoveFolderByClassIdBodyDto,
    userId: string,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.removeFolderByClassId(
      removeFolderByClassIdBodyDto,
      userId,
    );
  }

  async updateRecentClass(
    updateRecentClassBodyDto: UpdateRecentClassParamDto,
    userId: string,
  ) {
    return this.classRepository.updateRecentClass(
      updateRecentClassBodyDto,
      userId,
    );
  }

  async getRecentClassesByUserId(
    userId: string,
  ): Promise<GetClassResponseInterface[]> {
    return this.classRepository.getRecentClassesByUserId(userId);
  }

  async inviteUserJoinClass(
    inviteUserJoinClassBodyDto: InviteUserJoinClassBodyDto,
  ): Promise<InviteUserJoinClassResponseInterface> {
    return this.classRepository.inviteUserJoinClass(inviteUserJoinClassBodyDto);
  }

  async deleteAndExitAllClassesOfUser(userId: string): Promise<void> {
    return this.classRepository.deleteAndExitAllClassesOfUser(userId);
  }
}
