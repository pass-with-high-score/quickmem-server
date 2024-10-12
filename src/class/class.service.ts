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
import { SearchClassByTitleDto } from './dto/queries/search-class-by-title.dto';
import { AddMemberToClassDto } from './dto/bodies/add-member-to-class.dto';
import { JoinClassByTokenDto } from './dto/bodies/join-class-by-token.dto';
import { ExitClassDto } from './dto/bodies/exit-class.dto';
import { AddFoldersToClassDto } from './dto/bodies/add-folders-to-class.dto';
import { RemoveFolderFromClassDto } from './dto/bodies/remove-folder-from-class.dto';

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
  ): Promise<GetClassResponseInterface[]> {
    return this.classRepository.getClassesByUserId(getClassesByUserIdDto);
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
    searchClassByTitleDto: SearchClassByTitleDto,
  ): Promise<GetClassResponseInterface[]> {
    return this.classRepository.searchClassByTitle(searchClassByTitleDto);
  }

  async joinClassByJoinToken(
    joinClassByTokenDto: JoinClassByTokenDto,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.joinClassByJoinToken(joinClassByTokenDto);
  }

  async exitClass(exitClassDto: ExitClassDto): Promise<void> {
    return this.classRepository.exitClass(exitClassDto);
  }

  async addFoldersToClass(
    addFoldersToClassDto: AddFoldersToClassDto,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.addFoldersToClass(addFoldersToClassDto);
  }

  async removeFoldersFromClass(
    removeFoldersFromClassDto: RemoveFolderFromClassDto,
  ): Promise<GetClassResponseInterface> {
    return this.classRepository.removeFoldersFromClass(
      removeFoldersFromClassDto,
    );
  }
}
