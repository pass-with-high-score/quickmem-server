import {
  ConflictException,
  Inject,
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
import { SearchClassesByTitleQueryDto } from './dto/queries/search-classes-by-title-query.dto';
import { JoinClassByTokenDto } from './dto/bodies/join-class-by-token.dto';
import { ExitClassDto } from './dto/bodies/exit-class.dto';
import { logger } from '../winston-logger.service';
import { UpdateFoldersInClassDto } from './dto/bodies/update-folders-in-class.dto';
import { FolderEntity } from '../folder/entities/folder.entity';
import { UpdateStudySetsInClassDto } from './dto/bodies/update-study-sets-in-class.dto';
import { StudySetEntity } from '../study-set/entities/study-set.entity';
import { RemoveMembersFromClassDto } from './dto/bodies/remove-members-from-class.dto';
import { UpdateItemInClassResponseInterface } from './interfaces/update-item-in-class-response.interface';
import { GetClassByUserIdQueryDto } from './dto/queries/get-class-by-user-Id-query.dto';
import { GetClassByJoinTokenParamDto } from './dto/params/get-class-by-join-token.param.dto';
import { GetClassByJoinTokenQueryDto } from './dto/queries/get-class-by-join-token.query.dto';
import { RemoveStudySetByClassIdBodyDto } from './dto/bodies/remove-study-set-by-class-id-body.dto';
import { RemoveFolderByClassIdBodyDto } from './dto/bodies/remove-folder-by-class-id-body.dto';
import { UpdateRecentClassBodyDto } from './dto/bodies/update-recent-class-body.dto';
import { RecentClassEntity } from './entities/recent-class.entity';
import { InviteUserJoinClassBodyDto } from './dto/bodies/invite-user-join-class-body.dto';
import { InviteUserJoinClassResponseInterface } from './interfaces/invite-user-join-class-response.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypeEnum } from '../notification/enums/notification-type.enum';

@Injectable()
export class ClassRepository extends Repository<ClassEntity> {
  constructor(
    private dataSource: DataSource,
    @InjectQueue('send-email-class') private readonly sendEmailQueue: Queue,
    private configService: ConfigService,
    @Inject(NotificationService)
    private readonly notificationService: NotificationService,
  ) {
    super(ClassEntity, dataSource.createEntityManager());
  }

  // Search class by title
  async searchClassByTitle(
    searchClassesByTitleQueryDto: SearchClassesByTitleQueryDto,
  ): Promise<GetClassResponseInterface[]> {
    const { title, size = 40, page = 1 } = searchClassesByTitleQueryDto;
    if (page < 1) {
      throw new ConflictException('Invalid page number');
    }

    const [classes, total] = await this.findAndCount({
      where: { title: ILike(`%${title}%`) },
      relations: ['owner', 'members', 'folders', 'studySets'],
      take: size,
      skip: (page - 1) * size,
    });
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

    // Fetch class entity
    const classEntity = await this.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    // Fetch study sets
    classEntity.studySets = await this.dataSource
      .getRepository(StudySetEntity)
      .find({
        where: { classes: { id } },
        relations: ['owner', 'flashcards', 'subject', 'color'],
      });

    // Fetch folders
    classEntity.folders = await this.dataSource
      .getRepository(FolderEntity)
      .find({
        where: { classes: { id } },
        relations: ['studySets', 'owner'],
      });

    // add owner to members
    classEntity.members = [classEntity.owner];
    // Fetch members
    classEntity.members = [
      ...classEntity.members,
      ...(await this.dataSource
        .getRepository(UserEntity)
        .find({ where: { classes: { id } } })),
    ];

    return this.mapClassEntityToResponse(classEntity);
  }

  // Get classes by user id (if they are member or owner of class)
  async getClassesByUserId(
    getClassesByUserIdDto: GetClassesByUserIdDto,
    getClassByUserIdQueryDto: GetClassByUserIdQueryDto,
  ): Promise<GetClassResponseInterface[]> {
    const { userId } = getClassesByUserIdDto;
    const { studySetId, folderId } = getClassByUserIdQueryDto;
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
      throw new NotFoundException('No classes found for the user');
    }

    return Promise.all(
      classes.map(async (classEntity) => {
        let isImported = false;
        if (studySetId) {
          classEntity.studySets = classEntity.studySets.filter(
            (studySet) => studySet.id === studySetId,
          );
          if (classEntity.studySets.length > 0) {
            isImported = true;
          }
        }
        if (folderId) {
          classEntity.folders = classEntity.folders.filter(
            (folder) => folder.id === folderId,
          );
          if (classEntity.folders.length > 0) {
            isImported = true;
          }
        }
        const response = await this.mapClassEntityToResponse(
          classEntity,
          false,
          false,
          false,
        );
        return { ...response, isImported };
      }),
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
    classEntity.joinToken = this.generateRandomString(7);

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
    relations: string[],
  ): Promise<ClassEntity> {
    // Find class with specified relations
    const classEntity = await this.findOne({
      where: { id: classId },
      relations,
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
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
  ): Promise<UpdateItemInClassResponseInterface> {
    const { joinToken, userId, classId } = joinClassByTokenDto;

    const classEntity = await this.findClassAndValidatePermissions(classId, [
      'owner',
      'members',
      'studySets',
      'folders',
    ]);

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
      return {
        message: 'User joined class',
        length: classEntity.members.length,
        success: true,
      };
    } catch (error) {
      logger.error('Error joining class:', error);
      throw new InternalServerErrorException('Error joining class');
    }
  }

  async exitClass(exitClassDto: ExitClassDto): Promise<void> {
    const { userId, classId } = exitClassDto;

    const classEntity = await this.findClassAndValidatePermissions(classId, [
      'members',
    ]);

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

  async updateClassFolders(
    updateFoldersInClassDto: UpdateFoldersInClassDto,
  ): Promise<UpdateItemInClassResponseInterface> {
    const { classId, userId, folderIds } = updateFoldersInClassDto;

    const classEntity = await this.findClassAndValidatePermissions(classId, [
      'owner',
      'members',
      'folders',
      'studySets',
      'folders.studySets',
      'folders.owner',
    ]);

    // Find folders with their owners
    const folders = await this.findItemsByIds(
      this.dataSource.getRepository(FolderEntity),
      folderIds,
      ['owner'],
      'folder',
    );

    const userEntity = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: userId });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    if (!userEntity.isVerified) {
      throw new UnauthorizedException('User not verified');
    }

    if (
      classEntity.owner.id !== userId &&
      !classEntity.members.some((member) => member.id === userId)
    ) {
      throw new UnauthorizedException('User not a member of the class');
    }

    if (!classEntity.allowSetManagement && classEntity.owner.id !== userId) {
      throw new UnauthorizedException('Class does not allow set management');
    }

    // Check if all folders are found
    if (folders.length !== folderIds.length) {
      throw new NotFoundException('One or more folders not found');
    }

    // Check if all folders belong to the user
    await this.validateOwnershipOrManagement(folders, userId, 'folder');

    const remainingFolders = classEntity.folders.filter(
      (folder) => folder.owner.id !== userId || !folderIds.includes(folder.id),
    );

    // Add new folders that belong to the user and are not already in the class
    const newFolders = folders.filter(
      (folder) =>
        folder.owner.id === userId &&
        !classEntity.folders.some(
          (existingFolder) => existingFolder.id === folder.id,
        ),
    );

    // Combine the remaining folders with the new folders
    classEntity.folders = [...remainingFolders, ...newFolders];

    try {
      await this.save(classEntity);
      return {
        message: 'Folder update in class',
        length: classEntity.folders.length,
        success: true,
      };
    } catch (error) {
      logger.error('Error adding folders to class:', error);
      throw new InternalServerErrorException('Error adding folders to class');
    }
  }

  async updateStudySetsInClass(
    updateStudySetsInClassDto: UpdateStudySetsInClassDto,
  ): Promise<UpdateItemInClassResponseInterface> {
    const { classId, userId, studySetIds } = updateStudySetsInClassDto;

    const classEntity = await this.findClassAndValidatePermissions(classId, [
      'owner',
      'members',
      'folders',
      'studySets',
      'folders.studySets',
      'folders.owner',
      'studySets.owner',
    ]);

    const userEntity = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: userId });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    if (!userEntity.isVerified) {
      throw new UnauthorizedException('User not verified');
    }

    if (
      classEntity.owner.id !== userId &&
      !classEntity.members.some((member) => member.id === userId)
    ) {
      throw new UnauthorizedException('User not a member of the class');
    }

    if (!classEntity.allowSetManagement && classEntity.owner.id !== userId) {
      throw new UnauthorizedException('Class does not allow set management');
    }

    // Find study sets
    const studySets = await this.findItemsByIds(
      this.dataSource.getRepository(StudySetEntity),
      studySetIds,
      ['owner'],
      'study set',
    );

    if (studySets.length !== studySetIds.length) {
      throw new NotFoundException('One or more study sets not found');
    }

    // Check if all study sets belong to the user
    await this.validateOwnershipOrManagement(studySets, userId, 'study set');

    const remainingStudySets = classEntity.studySets.filter(
      (studySet) =>
        studySet.owner.id !== userId || !studySetIds.includes(studySet.id),
    );

    // Add new study sets that belong to the user and are not already in the class
    const newStudySets = studySets.filter(
      (studySet) =>
        studySet.owner.id === userId &&
        !classEntity.studySets.some(
          (existingSet) => existingSet.id === studySet.id,
        ),
    );

    // Combine the remaining study sets with the new study sets
    classEntity.studySets = [...remainingStudySets, ...newStudySets];

    console.log('updatedStudySets: ', classEntity.studySets);

    try {
      await this.save(classEntity);
      return {
        message: 'Study sets updated successfully',
        success: true,
        length: classEntity.studySets.length,
      };
    } catch (error) {
      logger.error('Error adding study sets to class:', error);
      throw new InternalServerErrorException(
        'Error adding study sets to class',
      );
    }
  }

  async removeMembersFromClass(
    removeMembersFromClassDto: RemoveMembersFromClassDto,
  ): Promise<GetClassResponseInterface> {
    const { classId, userId, memberIds } = removeMembersFromClassDto;

    // Find class
    const classEntity = await this.findClassAndValidatePermissions(classId, [
      'owner',
      'members',
      'folders',
      'studySets',
      'folders.studySets',
      'folders.owner',
    ]);

    if (!classEntity.allowMemberManagement && classEntity.owner.id !== userId) {
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
      return this.mapClassEntityToResponse(classEntity, false, false, false);
    } catch (error) {
      logger.error('Error removing members from class:', error);
      throw new InternalServerErrorException(
        'Error removing members from class',
      );
    }
  }

  async getClassByJoinToken(
    getClassByJoinTokenParamDto: GetClassByJoinTokenParamDto,
    getClassByJoinTokenQueryDto: GetClassByJoinTokenQueryDto,
  ): Promise<GetClassResponseInterface> {
    console.log(getClassByJoinTokenParamDto);
    console.log(getClassByJoinTokenQueryDto);
    const { joinToken } = getClassByJoinTokenParamDto;
    const { userId } = getClassByJoinTokenQueryDto;
    const classEntity = await this.findOne({
      where: { joinToken },
      relations: ['owner', 'members'],
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    const user = await this.dataSource.getRepository(UserEntity).findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: classEntity.id,
      title: classEntity.title,
      description: classEntity.description,
      owner: {
        id: classEntity.owner.id,
        role: classEntity.owner.role,
        username: classEntity.owner.username,
        avatarUrl: `${process.env.HOST}/public/images/avatar/${classEntity.owner.avatarUrl}.jpg`,
      },
      isJoined: classEntity.members.some((member) => member.id === userId),
      allowMemberManagement: classEntity.allowMemberManagement,
      allowSetManagement: classEntity.allowSetManagement,
      joinToken: classEntity.joinToken,
      createdAt: classEntity.createdAt,
      updatedAt: classEntity.updatedAt,
    };
  }

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
        role: classEntity.owner.role,
        username: classEntity.owner.username,
        avatarUrl: `${process.env.HOST}/public/images/avatar/${classEntity.owner.avatarUrl}.jpg`,
      },
      allowMemberManagement: classEntity.allowMemberManagement,
      allowSetManagement: classEntity.allowSetManagement,
      joinToken: classEntity.joinToken,
      memberCount: classEntity.members.length,
      studySetCount: classEntity.studySets.length,
      folderCount: classEntity.folders.length,
      members: showMembers
        ? classEntity.members.map((member) => ({
            id: member.id,
            username: member.username,
            avatarUrl: `${process.env.HOST}/public/images/avatar/${member.avatarUrl}.jpg`,
            isOwner: member.id === classEntity.owner.id,
            role: member.role,
          }))
        : undefined,
      studySets: showStudySets
        ? classEntity.studySets.map((studySet) => ({
            id: studySet.id,
            title: studySet.title,
            isAIGenerated: studySet.isAIGenerated,
            description: studySet.description,
            color: studySet.color
              ? {
                  id: studySet.color.id,
                  name: studySet.color.name,
                  hexValue: studySet.color.hexValue,
                }
              : undefined,
            subject: studySet.subject
              ? {
                  id: studySet.subject.id,
                  name: studySet.subject.name,
                }
              : undefined,
            flashcardCount: studySet.flashcards
              ? studySet.flashcards.length
              : 0,
            owner: {
              id: studySet.owner.id,
              username: studySet.owner.username,
              avatarUrl: `${process.env.HOST}/public/images/avatar/${studySet.owner.avatarUrl}.jpg`,
              role: studySet.owner.role,
            },
            createdAt: studySet.createdAt,
            updatedAt: studySet.updatedAt,
          }))
        : undefined,
      folders: showFolders
        ? classEntity.folders.map((folder) => ({
            id: folder.id,
            title: folder.title,
            linkShareCode: folder.link,
            description: folder.description,
            isPublic: folder.isPublic,
            studySetCount: folder.studySets ? folder.studySets.length : 0,
            owner: {
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

  private generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  async removeStudySetByClassId(
    removeStudySetByClassIdBodyDto: RemoveStudySetByClassIdBodyDto,
  ): Promise<GetClassResponseInterface> {
    const { userId, classId, studySetId } = removeStudySetByClassIdBodyDto;

    // Find class
    const classEntity = await this.findClassAndValidatePermissions(classId, [
      'owner',
      'members',
      'studySets',
      'folders',
      'folders.studySets',
      'folders.owner',
    ]);

    // Find user
    const userEntity = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: userId });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    if (!userEntity.isVerified) {
      throw new UnauthorizedException('User not verified');
    }

    // Check if user is the owner of the class
    if (classEntity.owner.id !== userId) {
      throw new UnauthorizedException('User is not the owner of the class');
    }

    // Find study set
    const studySet = await this.dataSource
      .getRepository(StudySetEntity)
      .findOneBy({ id: studySetId });

    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    // Check if study set belongs to the class
    if (!classEntity.studySets.some((set) => set.id === studySetId)) {
      throw new NotFoundException('Study set not found in the class');
    }

    // Remove study set from class
    classEntity.studySets = classEntity.studySets.filter(
      (set) => set.id !== studySetId,
    );

    try {
      await this.save(classEntity);
      return this.mapClassEntityToResponse(classEntity, false, false, false);
    } catch (error) {
      logger.error('Error removing study set from class:', error);
      throw new InternalServerErrorException(
        'Error removing study set from class',
      );
    }
  }

  async removeFolderByClassId(
    removeFolderByClassIdBodyDto: RemoveFolderByClassIdBodyDto,
  ): Promise<GetClassResponseInterface> {
    const { userId, classId, folderId } = removeFolderByClassIdBodyDto;

    // Find class
    const classEntity = await this.findClassAndValidatePermissions(classId, [
      'owner',
      'members',
      'studySets',
      'folders',
      'folders.studySets',
      'folders.owner',
    ]);

    // Find user
    const userEntity = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: userId });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    if (!userEntity.isVerified) {
      throw new UnauthorizedException('User not verified');
    }

    // Check if user is the owner of the class
    if (classEntity.owner.id !== userId) {
      throw new UnauthorizedException('User is not the owner of the class');
    }

    // Find folder
    const folder = await this.dataSource
      .getRepository(FolderEntity)
      .findOneBy({ id: folderId });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    // Check if folder belongs to the class
    if (!classEntity.folders.some((f) => f.id === folderId)) {
      throw new NotFoundException('Folder not found in the class');
    }

    // Remove folder from class
    classEntity.folders = classEntity.folders.filter((f) => f.id !== folderId);

    try {
      await this.save(classEntity);
      return this.mapClassEntityToResponse(classEntity, false, false, false);
    } catch (error) {
      logger.error('Error removing folders from class:', error);
      throw new InternalServerErrorException(
        'Error removing folders from class',
      );
    }
  }

  async updateRecentClass(updateRecentClassBodyDto: UpdateRecentClassBodyDto) {
    const { userId, classId } = updateRecentClassBodyDto;

    const recentClass = await this.dataSource
      .getRepository(RecentClassEntity)
      .findOne({
        where: { user: { id: userId }, classEntity: { id: classId } },
      });

    if (recentClass) {
      recentClass.accessedAt = new Date();
      await this.dataSource.getRepository(RecentClassEntity).save(recentClass);
      return;
    }

    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const classEntity = await this.findOne({
      where: { id: classId },
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    const recentClassEntity = new RecentClassEntity();
    recentClassEntity.user = user;
    recentClassEntity.classEntity = classEntity;

    await this.dataSource
      .getRepository(RecentClassEntity)
      .save(recentClassEntity);
  }

  async getRecentClassesByUserId(
    getClassesByUserIdDto: GetClassesByUserIdDto,
  ): Promise<GetClassResponseInterface[]> {
    const { userId } = getClassesByUserIdDto;
    try {
      const recentClasses = await this.dataSource
        .getRepository(RecentClassEntity)
        .find({
          where: { user: { id: userId } },
          relations: [
            'classEntity',
            'classEntity.owner',
            'classEntity.members',
            'classEntity.folders',
            'classEntity.studySets',
          ],
          order: { accessedAt: 'DESC' },
          take: 10,
        });

      return Promise.all(
        recentClasses.map((recentClass) =>
          this.mapClassEntityToResponse(
            recentClass.classEntity,
            false,
            false,
            false,
          ),
        ),
      );
    } catch (error) {
      console.log(error);
      logger.error('Error fetching recent classes by user ID', {
        userId,
        error,
      });
      throw new InternalServerErrorException(
        'Error fetching recent folders by user ID',
      );
    }
  }

  async inviteUserJoinClass(
    inviteUserJoinClassBodyDto: InviteUserJoinClassBodyDto,
  ): Promise<InviteUserJoinClassResponseInterface> {
    const { classId, username } = inviteUserJoinClassBodyDto;

    // Find class
    const classEntity = await this.findOne({
      where: { id: classId },
      relations: ['owner', 'members'],
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    // Find user
    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ username: username });

    if (!user) {
      return {
        message: `User ${username} not found`,
        status: false,
      };
    }

    if (!user.isVerified) {
      return {
        message: `User ${username} not verified`,
        status: false,
      };
    }

    if (classEntity.owner.id === user.id) {
      return {
        message: `User ${username} is the owner of the class`,
        status: false,
      };
    }

    // Check if user is already in the class
    if (classEntity.members.some((member) => member.username === username)) {
      return {
        message: `User ${username} already in the class`,
        status: false,
      };
    }

    try {
      await this.sendEmailQueue.add('send-invite-join-class', {
        email: user.email,
        from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
        joinToken: classEntity.joinToken,
      });
      await this.notificationService.createNotification({
        title: 'Invitation to join class',
        message: `You have been invited to join the class ${classEntity.title}`,
        userId: [user.id],
        notificationType: NotificationTypeEnum.INVITE_USER_JOIN_CLASS,
        data: {
          id: classEntity.id,
          code: classEntity.joinToken,
        },
      });
      return {
        message: 'Sent invite to user to join class',
        status: true,
      };
    } catch (error) {
      logger.error('Error inviting user to join class:', error);
      throw new InternalServerErrorException(
        'Error inviting user to join class',
      );
    }
  }
}
