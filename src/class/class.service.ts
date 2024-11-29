import { Injectable } from '@nestjs/common';
import { ClassRepository } from './class.repository';
import { CreateClassDto } from './dto/bodies/create-class.dto';
import { CreateClassResponseInterface } from './interfaces/create-class-response.interface';
import { GetClassByIdParamDto } from './dto/params/get-class-by-id-param.dto';
import { GetClassResponseInterface } from './interfaces/get-class-response.interface';
import { UpdateClassByIdParamDto } from './dto/params/update-class-by-id-param.dto';
import { UpdateClassByIdDto } from './dto/bodies/update-class-by-id.dto';
import { DeleteClassByIdParamDto } from './dto/params/delete-class-by-id-param.dto';
import { GetClassesByUserIdDto } from './dto/params/get-classes-by-user-id.dto';
import { SearchClassesByTitleQueryDto } from './dto/queries/search-classes-by-title-query.dto';
import { JoinClassByTokenDto } from './dto/bodies/join-class-by-token.dto';
import { ExitClassDto } from './dto/bodies/exit-class.dto';
import { UpdateStudySetsInClassDto } from './dto/bodies/update-study-sets-in-class.dto';
import { RemoveMembersFromClassDto } from './dto/bodies/remove-members-from-class.dto';
import { UpdateItemInClassResponseInterface } from './interfaces/update-item-in-class-response.interface';
import { UpdateFoldersInClassDto } from './dto/bodies/update-folders-in-class.dto';
import { GetClassByUserIdQueryDto } from './dto/queries/get-class-by-user-Id-query.dto';
import { GetClassByJoinTokenParamDto } from './dto/params/get-class-by-join-token.param.dto';
import { GetClassByJoinTokenQueryDto } from './dto/queries/get-class-by-join-token.query.dto';
import { RemoveStudySetByClassIdBodyDto } from './dto/bodies/remove-study-set-by-class-id-body.dto';
import { RemoveFolderByClassIdBodyDto } from './dto/bodies/remove-folder-by-class-id-body.dto';
import { UpdateRecentClassBodyDto } from './dto/bodies/update-recent-class-body.dto';
import { InviteUserJoinClassBodyDto } from './dto/bodies/invite-user-join-class-body.dto';
import { InviteUserJoinClassResponseInterface } from './interfaces/invite-user-join-class-response.interface';

@Injectable()
export class ClassService {
  constructor(private readonly classRepository: ClassRepository) {}

  async createClass(
    createClassDto: CreateClassDto,
  ): Promise<CreateClassResponseInterface> {
    return this.classRepository.createClass(createClassDto);
  }

  async getClassById(
    getClassByIdParamDto: GetClassByIdParamDto,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.getClassById(getClassByIdParamDto);
  }

  async getClassesByUserId(
    getClassesByUserIdDto: GetClassesByUserIdDto,
    getClassByUserIdQueryDto: GetClassByUserIdQueryDto,
  ): Promise<GetClassResponseInterface[]> {
    return this.classRepository.getClassesByUserId(
      getClassesByUserIdDto,
      getClassByUserIdQueryDto,
    );
  }

  async updateClass(
    updateClassByIdParamDto: UpdateClassByIdParamDto,
    updateClassByIdDto: UpdateClassByIdDto,
  ): Promise<CreateClassResponseInterface> {
    return this.classRepository.updateClass(
      updateClassByIdParamDto,
      updateClassByIdDto,
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
  ): Promise<UpdateItemInClassResponseInterface> {
    return this.classRepository.joinClassByJoinToken(joinClassByTokenDto);
  }

  async exitClass(exitClassDto: ExitClassDto): Promise<void> {
    return this.classRepository.exitClass(exitClassDto);
  }

  async updateClassFolders(
    updateFoldersInClassDto: UpdateFoldersInClassDto,
  ): Promise<UpdateItemInClassResponseInterface> {
    return this.classRepository.updateClassFolders(updateFoldersInClassDto);
  }

  async updateStudySetsInClass(
    updateStudySetsInClassDto: UpdateStudySetsInClassDto,
  ): Promise<UpdateItemInClassResponseInterface> {
    return this.classRepository.updateStudySetsInClass(
      updateStudySetsInClassDto,
    );
  }

  async removeMembersFromClass(
    removeMembersFromClassDto: RemoveMembersFromClassDto,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.removeMembersFromClass(
      removeMembersFromClassDto,
    );
  }

  async getClassByJoinToken(
    getClassByJoinTokenParamDto: GetClassByJoinTokenParamDto,
    getClassByJoinTokenQueryDto: GetClassByJoinTokenQueryDto,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.getClassByJoinToken(
      getClassByJoinTokenParamDto,
      getClassByJoinTokenQueryDto,
    );
  }

  async removeStudySetByClassId(
    removeStudySetByClassIdBodyDto: RemoveStudySetByClassIdBodyDto,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.removeStudySetByClassId(
      removeStudySetByClassIdBodyDto,
    );
  }

  async removeFolderByClassId(
    removeFolderByClassIdBodyDto: RemoveFolderByClassIdBodyDto,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.removeFolderByClassId(
      removeFolderByClassIdBodyDto,
    );
  }

  async updateRecentClass(updateRecentClassBodyDto: UpdateRecentClassBodyDto) {
    return this.classRepository.updateRecentClass(updateRecentClassBodyDto);
  }

  async getRecentClassesByUserId(
    getClassesByUserIdDto: GetClassesByUserIdDto,
  ): Promise<GetClassResponseInterface[]> {
    return this.classRepository.getRecentClassesByUserId(getClassesByUserIdDto);
  }

  async inviteUserJoinClass(
    inviteUserJoinClassBodyDto: InviteUserJoinClassBodyDto,
  ): Promise<InviteUserJoinClassResponseInterface> {
    return this.classRepository.inviteUserJoinClass(inviteUserJoinClassBodyDto);
  }
}
