import { Injectable } from '@nestjs/common';
import { ClassRepository } from './class.repository';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateClassResponseInterface } from './interfaces/create-class-response.interface';
import { GetClassByIdParamDto } from './dto/get-class-by-id-param.dto';
import { GetClassResponseInterface } from './interfaces/get-class-response.interface';
import { UpdateClassByIdParamDto } from './dto/update-class-by-id-param.dto';
import { UpdateClassByIdDto } from './dto/update-class-by-id.dto';
import { DeleteClassByIdParamDto } from './dto/delete-class-by-id-param.dto';

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
}
