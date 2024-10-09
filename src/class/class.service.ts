import { Injectable } from '@nestjs/common';
import { ClassRepository } from './class.repository';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateClassResponseInterface } from './interfaces/create-class-response.interface';

@Injectable()
export class ClassService {
  constructor(private readonly classRepository: ClassRepository) {}

  async createClass(
    createClassDto: CreateClassDto,
  ): Promise<CreateClassResponseInterface> {
    return this.classRepository.createClass(createClassDto);
  }
}
