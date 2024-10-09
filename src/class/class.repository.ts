import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ClassEntity } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateClassResponseInterface } from './interfaces/create-class-response.interface';
import { UserEntity } from '../auth/entities/user.entity';
import { GetClassByIdParamDto } from './dto/get-class-by-id-param.dto';
import { GetClassResponseInterface } from './interfaces/get-class-response.interface';

@Injectable()
export class ClassRepository extends Repository<ClassEntity> {
  constructor(private dataSource: DataSource) {
    super(ClassEntity, dataSource.createEntityManager());
  }

  // Search class by title

  // Get class by id

  // async getClassById(
  //   getClassByIdParamDto: GetClassByIdParamDto,
  // ): Promise<GetClassResponseInterface> {
  //   const { id } = getClassByIdParamDto;
  //
  //   const class = this.findOneBy({ id });
  // }

  // Get classes by user id (if they are member or owner of class)

  // Create class
  async createClass(
    createClassDto: CreateClassDto,
  ): Promise<CreateClassResponseInterface> {
    const { title, description, ownerId } = createClassDto;

    // Find owner
    const owner = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: ownerId });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    // Create class
    const classEntity = new ClassEntity();
    classEntity.title = title;
    classEntity.description = description;
    classEntity.owner = owner;

    try {
      await this.save(classEntity);
      return {
        id: classEntity.id,
        title: classEntity.title,
        description: classEntity.description,
        owner: classEntity.owner.id,
        createdAt: classEntity.createdAt,
        updatedAt: classEntity.updatedAt,
      };
    } catch (error) {
      console.log('Error creating class:', error);
      throw new Error('Error creating class');
    }
  }

  // Update class

  // Delete class

  // Add member to class (if user is owner or allowSetAndMemberManagement is true)

  // Remove member from class (if user is owner)

  // Add folder to class (if user is owner or allowSetAndMemberManagement is true)

  // Remove folder from class (if user is owner)

  // Add study set to class (if user is owner or allowSetAndMemberManagement is true)

  // Remove study set from class (if user is owner)
}
