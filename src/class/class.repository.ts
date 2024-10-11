import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ClassEntity } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateClassResponseInterface } from './interfaces/create-class-response.interface';
import { UserEntity } from '../auth/entities/user.entity';
import { GetClassByIdParamDto } from './dto/get-class-by-id-param.dto';
import { GetClassResponseInterface } from './interfaces/get-class-response.interface';
import { UpdateClassByIdDto } from './dto/update-class-by-id.dto';
import { UpdateClassByIdParamDto } from './dto/update-class-by-id-param.dto';
import { DeleteClassByIdParamDto } from './dto/delete-class-by-id-param.dto';
import { GetClassesByUserIdDto } from './dto/get-classes-by-user-id.dto';

@Injectable()
export class ClassRepository extends Repository<ClassEntity> {
  constructor(private dataSource: DataSource) {
    super(ClassEntity, dataSource.createEntityManager());
  }

  // Search class by title

  // Get class by id
  async getClassById(
    getClassByIdParamDto: GetClassByIdParamDto,
  ): Promise<GetClassResponseInterface> {
    const { id } = getClassByIdParamDto;

    const classEntity = await this.findOne({
      where: { id },
      relations: [
        'owner',
        'members',
        'folders',
        'studySets',
        'folders.studySets',
        'folders.owner',
        'studySets.owner',
        'studySets.flashcards',
      ],
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    return this.mapClassEntityToResponse(classEntity);
  }

  // Get classes by user id (if they are member or owner of class)
  async getClassesByUserId(
    getClassesByUserIdDto: GetClassesByUserIdDto,
  ): Promise<GetClassResponseInterface[]> {
    const { userId } = getClassesByUserIdDto;
    const classes = await this.find({
      where: [
        { owner: { id: userId } },
        { members: { id: userId } },
        { folders: { owner: { id: userId } } },
        { studySets: { owner: { id: userId } } },
      ],
      relations: [
        'owner',
        'members',
        'folders',
        'studySets',
        'folders.studySets',
        'folders.owner',
        'studySets.owner',
        'studySets.flashcards',
      ],
    });

    if (!classes) {
      return [];
    }

    return Promise.all(
      classes.map((classEntity) =>
        this.mapClassEntityToResponse(classEntity, false, false, false),
      ),
    );
  }

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
        allowSetAndMemberManagement: classEntity.allowSetAndMemberManagement,
        createdAt: classEntity.createdAt,
        updatedAt: classEntity.updatedAt,
      };
    } catch (error) {
      console.log('Error creating class:', error);
      throw new Error('Error creating class');
    }
  }

  // Update class
  async updateClass(
    updateClassByIdParamDto: UpdateClassByIdParamDto,
    updateClassByIdDto: UpdateClassByIdDto,
  ): Promise<CreateClassResponseInterface> {
    const { id } = updateClassByIdParamDto;
    const { title, description, ownerId } = updateClassByIdDto;

    // Find class
    const classEntity = await this.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    // Find owner
    const owner = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: ownerId });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    // Update class
    classEntity.title = title;
    classEntity.description = description;
    classEntity.owner = owner;
    classEntity.allowSetAndMemberManagement =
      updateClassByIdDto.allowSetAndMemberManagement;

    try {
      await this.save(classEntity);
      return {
        id: classEntity.id,
        title: classEntity.title,
        description: classEntity.description,
        owner: classEntity.owner.id,
        allowSetAndMemberManagement: classEntity.allowSetAndMemberManagement,
        createdAt: classEntity.createdAt,
        updatedAt: classEntity.updatedAt,
      };
    } catch (error) {
      console.log('Error updating class:', error);
      throw new Error('Error updating class');
    }
  }

  // Delete class
  async deleteClassById(
    deleteClassByIdParamDto: DeleteClassByIdParamDto,
  ): Promise<void> {
    const { id } = deleteClassByIdParamDto;

    // Find class
    const classEntity = await this.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    try {
      await this.remove(classEntity);
    } catch (error) {
      console.log('Error deleting class:', error);
      throw new Error('Error deleting class');
    }
  }

  // Add member to class (if user is owner or allowSetAndMemberManagement is true)

  // Remove member from class (if user is owner)

  // Add folder to class (if user is owner or allowSetAndMemberManagement is true)

  // Remove folder from class (if user is owner)

  // Add study set to class (if user is owner or allowSetAndMemberManagement is true)

  // Remove study set from class (if user is owner)

  async mapClassEntityToResponse(
    classEntity: ClassEntity,
    showMembers = true,
    showStudySets = true,
    showFolders = true,
  ): Promise<GetClassResponseInterface> {
    return {
      id: classEntity.id,
      title: classEntity.title,
      description: classEntity.description,
      owner: {
        id: classEntity.owner.id,
        username: classEntity.owner.username,
        avatarUrl: classEntity.owner.avatarUrl,
      },
      memberCount: classEntity.members.length,
      studySetCount: classEntity.studySets.length,
      folderCount: classEntity.folders.length,
      members: showMembers
        ? classEntity.members.map((member) => ({
            id: member.id,
            username: member.username,
            avatarUrl: member.avatarUrl,
          }))
        : undefined,
      studySets: showStudySets
        ? classEntity.studySets.map((studySet) => ({
            id: studySet.id,
            title: studySet.title,
            description: studySet.description,
            flashcardCount: studySet.flashcards.length,
            owner: {
              id: studySet.owner.id,
              username: studySet.owner.username,
              avatarUrl: studySet.owner.avatarUrl,
            },
            createdAt: studySet.createdAt,
            updatedAt: studySet.updatedAt,
          }))
        : undefined,
      folders: showFolders
        ? classEntity.folders.map((folder) => ({
            id: folder.id,
            title: folder.title,
            description: folder.description,
            isPublic: folder.isPublic,
            studySetCount: folder.studySets.length,
            ownerId: folder.owner.id,
            user: {
              id: folder.owner.id,
              username: folder.owner.username,
              avatarUrl: folder.owner.avatarUrl,
              role: folder.owner.role,
            },
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
          }))
        : undefined,
      createdAt: classEntity.createdAt,
      updatedAt: classEntity.updatedAt,
    };
  }
}
