import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { ClassEntity } from './entities/class.entity';
import { CreateClassDto } from './dto/bodies/create-class.dto';
import { CreateClassResponseInterface } from './interfaces/create-class-response.interface';
import { UserEntity } from '../auth/entities/user.entity';
import { GetClassByIdParamDto } from './dto/params/get-class-by-id-param.dto';
import { GetClassResponseInterface } from './interfaces/get-class-response.interface';
import { UpdateClassByIdDto } from './dto/bodies/update-class-by-id.dto';
import { UpdateClassByIdParamDto } from './dto/params/update-class-by-id-param.dto';
import { DeleteClassByIdParamDto } from './dto/params/delete-class-by-id-param.dto';
import { GetClassesByUserIdDto } from './dto/params/get-classes-by-user-id.dto';
import { SearchClassByTitleDto } from './dto/queries/search-class-by-title.dto';
import { randomBytes } from 'crypto';
import { JoinClassByTokenDto } from './dto/bodies/join-class-by-token.dto';
import { ExitClassDto } from './dto/bodies/exit-class.dto';
import { logger } from '../winston-logger.service';
import { AddFoldersToClassDto } from './dto/bodies/add-folders-to-class.dto';
import { RemoveFoldersFromClassDto } from './dto/bodies/remove-folders-from-class.dto';
import { FolderEntity } from '../folder/entities/folder.entity';
import { AddStudySetsToClassDto } from './dto/bodies/add-study-sets-to-class.dto';
import { StudySetEntity } from '../study-set/entities/study-set.entity';
import { RemoveStudySetsFromClassDto } from './dto/bodies/remove-study-sets-from-class.dto';
import { RemoveMembersFromClassDto } from './dto/bodies/remove-members-from-class.dto';
import process from 'node:process';

@Injectable()
export class ClassRepository extends Repository<ClassEntity> {
  constructor(private dataSource: DataSource) {
    super(ClassEntity, dataSource.createEntityManager());
  }

  // Search class by title
  async searchClassByTitle(
    searchClassByTitleDto: SearchClassByTitleDto,
  ): Promise<GetClassResponseInterface[]> {
    const { title, size = 40, page = 0 } = searchClassByTitleDto;

    const [classes, total] = await this.findAndCount({
      where: { title: ILike(`%${title}%`) },
      relations: ['owner', 'members', 'folders', 'studySets'],
      take: size,
      skip: page * size,
    });
    console.log(total);
    if (!classes.length) {
      throw new NotFoundException('No classes found with the given title');
    }

    return Promise.all(
      classes.map((classEntity) =>
        this.mapClassEntityToResponse(classEntity, false, false, false),
      ),
    );
  }

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
    classEntity.allowMemberManagement = createClassDto.allowMemberManagement;
    classEntity.allowSetManagement = createClassDto.allowSetManagement;
    classEntity.joinToken = randomBytes(7).toString('base64').substring(0, 7);

    try {
      await this.save(classEntity);
      return {
        id: classEntity.id,
        title: classEntity.title,
        description: classEntity.description,
        allowSetManagement: classEntity.allowSetManagement,
        allowMemberManagement: classEntity.allowMemberManagement,
        joinToken: classEntity.joinToken,
        createdAt: classEntity.createdAt,
        updatedAt: classEntity.updatedAt,
      };
    } catch (error) {
      logger.error('Error creating class:', error);
      throw new InternalServerErrorException('Error creating class');
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
    classEntity.allowMemberManagement =
      updateClassByIdDto.allowMemberManagement;
    classEntity.allowSetManagement = updateClassByIdDto.allowSetManagement;

    try {
      await this.save(classEntity);
      return {
        id: classEntity.id,
        title: classEntity.title,
        description: classEntity.description,
        allowSetManagement: classEntity.allowSetManagement,
        allowMemberManagement: classEntity.allowMemberManagement,
        joinToken: classEntity.joinToken,
        createdAt: classEntity.createdAt,
        updatedAt: classEntity.updatedAt,
      };
    } catch (error) {
      logger.error('Error updating class:', error);
      throw new InternalServerErrorException('Error updating class');
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
      logger.error('Error deleting class:', error);
      throw new InternalServerErrorException('Error deleting class');
    }
  }

  private async findClassAndValidatePermissions(
    classId: string,
    userId: string,
    relations: string[],
    checkOwnership: boolean = false,
    allowSetManagement: boolean = false,
  ): Promise<ClassEntity> {
    // Find class with specified relations
    const classEntity = await this.findOne({
      where: { id: classId },
      relations,
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    // Check ownership if necessary
    if (checkOwnership && classEntity.owner.id !== userId) {
      throw new UnauthorizedException('User is not the owner of the class');
    }

    // Check if class allows set management or if the user is the owner
    if (
      !checkOwnership &&
      allowSetManagement &&
      !classEntity.allowSetManagement
    ) {
      throw new UnauthorizedException('Class does not allow set management');
    }

    return classEntity;
  }

  private async validateOwnershipOrManagement(
    items: (FolderEntity | StudySetEntity)[],
    userId: string,
    entityName: string,
  ) {
    // Check if all items belong to the user
    for (const item of items) {
      if (item.owner.id !== userId) {
        throw new UnauthorizedException(
          `One or more ${entityName}s do not belong to the user`,
        );
      }
    }
  }

  private async findItemsByIds<T>(
    repository: Repository<T>,
    ids: string[],
    relations: string[],
    entityName: string,
  ): Promise<T[]> {
    const items = await repository.find({
      where: { id: In(ids) as any } as any,
      relations,
    });
    logger.info(`ids: ${ids}, items: ${items}`);

    if (items.length !== ids.length) {
      throw new NotFoundException(`One or more ${entityName}s not found`);
    }

    return items;
  }

  async joinClassByJoinToken(
    joinClassByTokenDto: JoinClassByTokenDto,
  ): Promise<GetClassResponseInterface> {
    const { joinToken, userId, classId } = joinClassByTokenDto;

    const classEntity = await this.findClassAndValidatePermissions(
      classId,
      userId,
      ['owner', 'members', 'studySets', 'folders'],
    );

    // Check if join token is correct
    if (classEntity.joinToken !== joinToken) {
      throw new UnauthorizedException('Invalid join token');
    }

    // Find user
    const user = await this.dataSource.getRepository(UserEntity).findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('User not verified');
    }

    // Check if user already in class
    if (classEntity.members.some((member) => member.id === userId)) {
      throw new ConflictException('User already in class');
    }

    // Add user to class
    classEntity.members = [...classEntity.members, user];

    try {
      await this.save(classEntity);
      return this.mapClassEntityToResponse(classEntity);
    } catch (error) {
      logger.error('Error joining class:', error);
      throw new InternalServerErrorException('Error joining class');
    }
  }

  async exitClass(exitClassDto: ExitClassDto): Promise<void> {
    const { userId, classId } = exitClassDto;

    const classEntity = await this.findClassAndValidatePermissions(
      classId,
      userId,
      ['members'],
    );

    const userIndex = classEntity.members.findIndex(
      (member) => member.id === userId,
    );
    if (userIndex === -1) {
      throw new NotFoundException('User not a member of the class');
    }

    classEntity.members.splice(userIndex, 1);

    try {
      await this.save(classEntity);
    } catch (error) {
      logger.error('Error exiting class:', error);
      throw new InternalServerErrorException('Error exiting class');
    }
  }

  async addFoldersToClass(
    addFoldersToClassDto: AddFoldersToClassDto,
  ): Promise<GetClassResponseInterface> {
    const { classId, userId, folderIds } = addFoldersToClassDto;

    const classEntity = await this.findClassAndValidatePermissions(
      classId,
      userId,
      [
        'owner',
        'members',
        'folders',
        'studySets',
        'folders.studySets',
        'folders.owner',
      ],
      false,
      true,
    );

    // Find folders with their owners
    const folders = await this.findItemsByIds(
      this.dataSource.getRepository(FolderEntity),
      folderIds,
      ['owner'],
      'folder',
    );

    // Check if all folders belong to the user
    await this.validateOwnershipOrManagement(folders, userId, 'folder');

    // Check if any folder is already added to the class
    for (const folder of folders) {
      if (
        classEntity.folders.some(
          (existingFolder) => existingFolder.id === folder.id,
        )
      ) {
        throw new ConflictException(
          `Folder with id ${folder.id} is already added to the class`,
        );
      }
    }

    // Add folders to class
    classEntity.folders = [...classEntity.folders, ...folders];

    try {
      await this.save(classEntity);
      return this.mapClassEntityToResponse(classEntity);
    } catch (error) {
      logger.error('Error adding folders to class:', error);
      throw new InternalServerErrorException('Error adding folders to class');
    }
  }

  async removeFoldersFromClass(
    removeFoldersFromClassDto: RemoveFoldersFromClassDto,
  ): Promise<GetClassResponseInterface> {
    const { classId, userId, folderIds } = removeFoldersFromClassDto;

    const classEntity = await this.findClassAndValidatePermissions(
      classId,
      userId,
      ['folders', 'owner', 'members', 'studySets'],
      false,
      true,
    );

    // Find folders
    const folders = await this.findItemsByIds(
      this.dataSource.getRepository(FolderEntity),
      folderIds,
      ['owner'],
      'folder',
    );

    // Check if all folders belong to the user
    await this.validateOwnershipOrManagement(folders, userId, 'folder');

    // Remove folders from class
    classEntity.folders = classEntity.folders.filter(
      (existingFolder) => !folderIds.includes(existingFolder.id),
    );

    try {
      await this.save(classEntity);
      return this.mapClassEntityToResponse(classEntity);
    } catch (error) {
      logger.error('Error removing folders from class:', error);
      throw new InternalServerErrorException(
        'Error removing folders from class',
      );
    }
  }

  async addStudySetsToClass(
    addStudySetsToClassDto: AddStudySetsToClassDto,
  ): Promise<GetClassResponseInterface> {
    const { classId, userId, studySetIds } = addStudySetsToClassDto;

    const classEntity = await this.findClassAndValidatePermissions(
      classId,
      userId,
      [
        'owner',
        'members',
        'folders',
        'studySets',
        'folders.studySets',
        'folders.owner',
      ],
      false,
      true,
    );

    // Find study sets
    const studySets = await this.findItemsByIds(
      this.dataSource.getRepository(StudySetEntity),
      studySetIds,
      ['owner'],
      'study set',
    );

    // Check if all study sets belong to the user
    await this.validateOwnershipOrManagement(studySets, userId, 'study set');

    // Check if any study set is already added to the class
    for (const studySet of studySets) {
      if (
        classEntity.studySets.some(
          (existingStudySet) => existingStudySet.id === studySet.id,
        )
      ) {
        throw new ConflictException(
          `Study set with id ${studySet.id} is already added to the class`,
        );
      }
    }

    // Add study sets to class
    classEntity.studySets = [...classEntity.studySets, ...studySets];

    try {
      await this.save(classEntity);
      return this.mapClassEntityToResponse(classEntity);
    } catch (error) {
      logger.error('Error adding study sets to class:', error);
      throw new InternalServerErrorException(
        'Error adding study sets to class',
      );
    }
  }

  async removeStudySetsFromClass(
    removeStudySetsFromClassDto: RemoveStudySetsFromClassDto,
  ): Promise<GetClassResponseInterface> {
    const { classId, userId, studySetIds } = removeStudySetsFromClassDto;

    const classEntity = await this.findClassAndValidatePermissions(
      classId,
      userId,
      [
        'owner',
        'members',
        'folders',
        'studySets',
        'folders.studySets',
        'folders.owner',
      ],
      false,
      true,
    );

    // Find study sets
    const studySets = await this.findItemsByIds(
      this.dataSource.getRepository(StudySetEntity),
      studySetIds,
      ['owner'],
      'study set',
    );

    // Check if all study sets belong to the user
    await this.validateOwnershipOrManagement(studySets, userId, 'study set');

    // Remove study sets from class
    classEntity.studySets = classEntity.studySets.filter(
      (existingStudySet) => !studySetIds.includes(existingStudySet.id),
    );

    try {
      await this.save(classEntity);
      return this.mapClassEntityToResponse(classEntity);
    } catch (error) {
      logger.error('Error removing study sets from class:', error);
      throw new InternalServerErrorException(
        'Error removing study sets from class',
      );
    }
  }

  async removeMembersFromClass(
    removeMembersFromClassDto: RemoveMembersFromClassDto,
  ): Promise<GetClassResponseInterface> {
    const { classId, userId, memberIds } = removeMembersFromClassDto;
    logger.info(
      `classId: ${classId}, userId: ${userId}, memberIds: ${memberIds}`,
    );

    // Find class
    const classEntity = await this.findClassAndValidatePermissions(
      classId,
      userId,
      [
        'owner',
        'members',
        'folders',
        'studySets',
        'folders.studySets',
        'folders.owner',
      ],
      false,
      true,
    );

    if (!classEntity.allowMemberManagement) {
      throw new UnauthorizedException('Class does not allow member management');
    }

    // if user is not the owner of the class
    if (classEntity.owner.id !== userId) {
      throw new UnauthorizedException('User is not the owner of the class');
    }

    // Find members
    logger.info('memberIds: ' + memberIds);
    const members = await this.findItemsByIds(
      this.dataSource.getRepository(UserEntity),
      memberIds,
      [],
      'member',
    );

    // Check if all members are in the class
    for (const member of members) {
      if (
        !classEntity.members.some(
          (existingMember) => existingMember.id === member.id,
        )
      ) {
        throw new NotFoundException(
          `Member with id ${member.id} is not in the class`,
        );
      }
    }

    // Remove members from class
    classEntity.members = classEntity.members.filter(
      (existingMember) => !memberIds.includes(existingMember.id),
    );

    try {
      await this.save(classEntity);
      return this.mapClassEntityToResponse(classEntity);
    } catch (error) {
      logger.error('Error removing members from class:', error);
      throw new InternalServerErrorException(
        'Error removing members from class',
      );
    }
  }

  async mapClassEntityToResponse(
    classEntity: ClassEntity,
    showMembers = true,
    showStudySets = true,
    showFolders = true,
  ): Promise<GetClassResponseInterface> {
    return {
      allowMemberManagement: classEntity.allowMemberManagement,
      allowSetManagement: classEntity.allowSetManagement,
      joinToken: classEntity.joinToken,
      id: classEntity.id,
      title: classEntity.title,
      description: classEntity.description,
      owner: {
        id: classEntity.owner.id,
        username: classEntity.owner.username,
        avatarUrl: `${process.env.HOST}/public/images/avatar/${classEntity.owner.avatarUrl}.jpg`,
      },
      memberCount: classEntity.members.length,
      studySetCount: classEntity.studySets.length,
      folderCount: classEntity.folders.length,
      members: showMembers
        ? classEntity.members.map((member) => ({
            id: member.id,
            username: member.username,
            avatarUrl: `${process.env.HOST}/public/images/avatar/${member.avatarUrl}.jpg`,
          }))
        : undefined,
      studySets: showStudySets
        ? classEntity.studySets.map((studySet) => ({
            id: studySet.id,
            title: studySet.title,
            description: studySet.description,
            flashcardCount: studySet.flashcards
              ? studySet.flashcards.length
              : 0,
            owner: {
              id: studySet.owner.id,
              username: studySet.owner.username,
              avatarUrl: `${process.env.HOST}/public/images/avatar/${studySet.owner.avatarUrl}.jpg`,
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
            studySetCount: folder.studySets ? folder.studySets.length : 0,
            ownerId: folder.owner.id,
            user: {
              id: folder.owner.id,
              username: folder.owner.username,
              avatarUrl: `${process.env.HOST}/public/images/avatar/${folder.owner.avatarUrl}.jpg`,
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
