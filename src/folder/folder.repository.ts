import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { FolderEntity } from './entities/folder.entity';
import { CreateFolderDto } from './dto/bodies/create-folder.dto';
import { FolderResponseInterface } from './interfaces/folder-response.interface';
import { UserEntity } from '../auth/entities/user.entity';
import { GetFoldersByOwnerIdDto } from './dto/params/get-folders-by-owner-id.dto';
import { GetFolderResponseInterface } from './interfaces/get-folder-response.interface';
import { GetFoldersByIdDto } from './dto/params/get-folders-by-id.dto';
import { UpdateStudySetsInFolderDto } from './dto/bodies/update-study-sets-in-folder.dto';
import { StudySetEntity } from '../study-set/entities/study-set.entity';
import { UpdateFolderDto } from './dto/bodies/update-folder.dto';
import { UpdateFolderByIdDto } from './dto/params/update-folder-by-id.dto';
import { DeleteFolderByIdDto } from './dto/params/delete-folder-by-id.dto';
import { SearchFoldersByTitleQueryDto } from './dto/queries/search-folders-by-title-query.dto';
import { UpdateStudySetsInFolderResponseInterface } from './interfaces/update-study-sets-in-folder-response.interface';
import { GetFolderByOwnerIdQueryDto } from './dto/queries/get-folder-by-owner-Id-query.dto';
import { logger } from '../winston-logger.service';
import { GetFolderByCodeParamDto } from './dto/params/get-folder-by-code.param.dto';
import { RecentStudySetEntity } from '../study-set/entities/recent-study-set.entity';
import { UpdateRecentFolderBodyDto } from './dto/bodies/update-recent-folder-body.dto';
import { RecentFolderEntity } from './entities/recent-folder.entity';
import { GetFoldersByUserIdDto } from './dto/params/get-folders-by-user-Id.dto';
import { ResetFlashcardProgressInFolderParamDto } from './dto/params/reset-flashcard-progress-in-folder-param.dto';
import { ResetFlashcardProgressInFolderQueryDto } from './dto/queries/reset-flashcard-progress-in-folder-query.dto';
import { ResetFlashcardProgressResponseInterface } from '../study-set/interfaces/reset-flashcard-progress-response.interface';
import { FlashcardStatusEnum } from '../flashcard/enums/flashcard-status.enum';
import { FlipFlashcardStatus } from '../flashcard/enums/flip-flashcard-status';
import { TrueFalseStatusEnum } from '../flashcard/enums/true-false-status.enum';
import { WriteStatusEnum } from '../flashcard/enums/write-status.enum';
import { QuizFlashcardStatusEnum } from '../flashcard/enums/quiz-flashcard-status.enum';
import { FlashcardEntity } from '../flashcard/entities/flashcard.entity';

@Injectable()
export class FolderRepository extends Repository<FolderEntity> {
  constructor(private dataSource: DataSource) {
    super(FolderEntity, dataSource.createEntityManager());
  }

  async createFolder(
    createFolderDto: CreateFolderDto,
  ): Promise<FolderResponseInterface> {
    const { title, description, isPublic, ownerId } = createFolderDto;

    const owner = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: ownerId });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const folder = new FolderEntity();
    folder.title = title;
    folder.description = description;
    folder.isPublic = isPublic;
    folder.owner = owner;
    folder.link = this.generateRandomString(7);

    try {
      await this.save(folder);
      return {
        id: folder.id,
        title: folder.title,
        description: folder.description,
        isPublic: folder.isPublic,
        linkShareCode: folder.link,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
      };
    } catch (error) {
      console.log('Error creating folder:', error);
      throw new Error('Error creating folder');
    }
  }

  async getFolderById(
    getFoldersByIdDto: GetFoldersByIdDto,
  ): Promise<GetFolderResponseInterface> {
    const { id } = getFoldersByIdDto;
    try {
      const folder = await this.findOne({
        where: { id: id },
        relations: [
          'owner',
          'studySets.owner',
          'studySets.flashcards',
          'studySets.color',
          'studySets.subject',
        ],
      });

      if (!folder) {
        throw new NotFoundException('Folder not found');
      }

      return this.mapFolderToGetFolderResponseInterface(folder, true);
    } catch (error) {
      console.error('Error fetching folder by ID:', error);
      throw new NotFoundException('Error fetching folder by ID');
    }
  }

  async getFolderByOwnerId(
    getFoldersByOwnerIdDto: GetFoldersByOwnerIdDto,
    getFolderByOwnerIdQueryDto: GetFolderByOwnerIdQueryDto,
  ): Promise<GetFolderResponseInterface[]> {
    const { ownerId } = getFoldersByOwnerIdDto;
    const { studySetId, classId } = getFolderByOwnerIdQueryDto;
    try {
      const folders = await this.find({
        where: { owner: { id: ownerId } },
        relations: ['owner', 'studySets', 'classes'],
      });

      return Promise.all(
        folders.map(async (folder) => {
          let isImported = false;
          if (studySetId) {
            folder.studySets = folder.studySets.filter(
              (studySet) => studySet.id === studySetId,
            );
            if (folder.studySets.length > 0) {
              isImported = true;
            }
          }
          if (classId) {
            folder.classes = folder.classes.filter(
              (classEntity) => classEntity.id === classId,
            );
            if (folder.classes.length > 0) {
              isImported = true;
            }
          }
          const response = await this.mapFolderToGetFolderResponseInterface(
            folder,
            false,
          );
          return { ...response, isImported };
        }),
      );
    } catch (error) {
      logger.error('Error fetching folders by user ID', { ownerId, error });
      throw new InternalServerErrorException(
        'Error fetching folders by user ID',
      );
    }
  }

  async updateFolder(
    updateFoldersByIdDto: UpdateFolderByIdDto,
    updateFolderDto: UpdateFolderDto,
  ): Promise<GetFolderResponseInterface> {
    const { id } = updateFoldersByIdDto;
    const folder = await this.findOne({
      where: { id },
      relations: [
        'owner',
        'studySets',
        'studySets.owner',
        'studySets.flashcards',
      ],
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const { title, description, isPublic } = updateFolderDto;

    if (title !== undefined) folder.title = title;
    if (description !== undefined) folder.description = description;
    if (isPublic !== undefined) folder.isPublic = isPublic;

    try {
      await this.save(folder);
      return this.mapFolderToGetFolderResponseInterface(folder, false, false);
    } catch (error) {
      console.error('Error updating folder:', error);
      throw new Error('Error updating folder');
    }
  }

  async updateStudySetsInFolder(
    updateStudySetsInFolderDto: UpdateStudySetsInFolderDto,
  ): Promise<UpdateStudySetsInFolderResponseInterface> {
    const { folderId, studySetIds } = updateStudySetsInFolderDto;
    const folder = await this.findOne({
      where: { id: folderId },
      relations: ['studySets', 'studySets.owner', 'owner'],
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    // Fetch all the study sets corresponding to the provided IDs.
    const studySets = await this.dataSource.getRepository(StudySetEntity).find({
      where: { id: In(studySetIds) },
      relations: ['owner'],
    });
    if (studySets.length !== studySetIds.length) {
      throw new NotFoundException('One or more study sets not found');
    }

    if (studySets.some((studySet) => studySet.owner.id !== folder.owner.id)) {
      throw new ConflictException(
        'One or more study sets do not belong to user',
      );
    }

    // Update folder's study sets based on the provided IDs
    folder.studySets = studySets;

    try {
      await this.save(folder);
      return {
        success: true,
        length: studySets.length,
        message: 'Study sets updated in folder',
      };
    } catch (error) {
      console.error('Error updating folder:', error);
      throw new InternalServerErrorException('Error updating folder');
    }
  }

  async deleteFolder(deleteFolderByIdDto: DeleteFolderByIdDto): Promise<void> {
    const { id } = deleteFolderByIdDto;
    const folder = await this.findOne({ where: { id } });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    try {
      await this.remove(folder);
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw new InternalServerErrorException('Error deleting folder');
    }
  }

  async searchFolderByTitle(
    searchFoldersByTitleQueryDto: SearchFoldersByTitleQueryDto,
  ): Promise<GetFolderResponseInterface[]> {
    const { title, size = 40, page = 1 } = searchFoldersByTitleQueryDto;
    if (page < 1) {
      throw new ConflictException('Invalid page number');
    }

    const [folders, total] = await this.findAndCount({
      where: { title: ILike(`%${title}%`), isPublic: true },
      relations: [
        'owner',
        'studySets',
        'studySets.owner',
        'studySets.flashcards',
      ],
      take: size,
      skip: (page - 1) * size,
    });
    return Promise.all(
      folders.map((folder) =>
        this.mapFolderToGetFolderResponseInterface(folder, false),
      ),
    );
  }

  async mapFolderToGetFolderResponseInterface(
    folder: FolderEntity,
    showFlashcards = false,
    showUser = true,
  ): Promise<GetFolderResponseInterface> {
    return {
      id: folder.id,
      title: folder.title,
      linkShareCode: folder.link,
      description: folder.description,
      isPublic: folder.isPublic,
      studySetCount: folder.studySets ? folder.studySets.length : 0,
      owner: showUser
        ? {
            id: folder.owner.id,
            username: folder.owner.username,
            avatarUrl: `${process.env.HOST}/public/images/avatar/${folder.owner.avatarUrl}.jpg`,
            role: folder.owner.role,
          }
        : undefined,
      studySets: showFlashcards
        ? folder.studySets.map((studySet) => ({
            id: studySet.id,
            title: studySet.title,
            description: studySet.description,
            isAIGenerated: studySet.isAIGenerated,
            isPublic: studySet.isPublic,
            ownerId: studySet.owner.id,
            flashcardCount: studySet.flashcards
              ? studySet.flashcards.length
              : 0,
            linkShareCode: studySet.link,
            flashcards: [],
            subject: studySet.subject
              ? {
                  id: studySet.subject.id,
                  name: studySet.subject.name,
                }
              : undefined,
            owner: {
              id: studySet.owner.id,
              username: studySet.owner.username,
              avatarUrl: `${process.env.HOST}/public/images/avatar/${studySet.owner.avatarUrl}.jpg`,
              role: studySet.owner.role,
            },
            color: studySet.color
              ? {
                  id: studySet.color.id,
                  name: studySet.color.name,
                  hexValue: studySet.color.hexValue,
                }
              : undefined,
            createdAt: studySet.createdAt,
            updatedAt: studySet.updatedAt,
          }))
        : [],
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    };
  }

  async getFolderByCode(
    getFolderByCodeParamDto: GetFolderByCodeParamDto,
  ): Promise<GetFolderResponseInterface> {
    const { code } = getFolderByCodeParamDto;
    try {
      const folder = await this.findOne({
        where: { link: code },
      });

      if (!folder) {
        throw new NotFoundException('Folder not found');
      }

      return this.mapFolderToGetFolderResponseInterface(folder, false, false);
    } catch (error) {
      console.error('Error fetching folder by code:', error);
      throw new NotFoundException('Error fetching folder by code');
    }
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

  async updateRecentFolder(
    updateRecentFolderBodyDto: UpdateRecentFolderBodyDto,
  ) {
    const { userId, folderId } = updateRecentFolderBodyDto;

    const recentFolder = await this.dataSource
      .getRepository(RecentFolderEntity)
      .findOne({
        where: { user: { id: userId }, folder: { id: folderId } },
      });

    if (recentFolder) {
      recentFolder.accessedAt = new Date();
      await this.dataSource
        .getRepository(RecentStudySetEntity)
        .save(recentFolder);
      return;
    }

    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const folder = await this.findOne({
      where: { id: folderId },
    });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const recentFolderEntity = new RecentFolderEntity();
    recentFolderEntity.user = user;
    recentFolderEntity.folder = folder;

    await this.dataSource
      .getRepository(RecentFolderEntity)
      .save(recentFolderEntity);
  }

  async getRecentFoldersByUserId(
    getFoldersByUserIdDto: GetFoldersByUserIdDto,
  ): Promise<GetFolderResponseInterface[]> {
    const { userId } = getFoldersByUserIdDto;
    try {
      const recentFolders = await this.dataSource
        .getRepository(RecentFolderEntity)
        .find({
          where: { user: { id: userId } },
          relations: ['folder', 'folder.owner', 'folder.studySets'],
          order: { accessedAt: 'DESC' },
          take: 15,
        });

      return Promise.all(
        recentFolders.map((recentFolder) =>
          this.mapFolderToGetFolderResponseInterface(
            recentFolder.folder,
            false,
          ),
        ),
      );
    } catch (error) {
      logger.error('Error fetching recent folders by user ID', {
        userId,
        error,
      });
      throw new InternalServerErrorException(
        'Error fetching recent folders by user ID',
      );
    }
  }

  // Reset progress of all flashcards in a study sets in a folder
  async resetFlashcardProgressInFolder(
    resetFlashcardProgressInFolderParamDto: ResetFlashcardProgressInFolderParamDto,
    resetFlashcardProgressInFolderQueryDto: ResetFlashcardProgressInFolderQueryDto,
  ): Promise<ResetFlashcardProgressResponseInterface> {
    const { id } = resetFlashcardProgressInFolderParamDto;
    const { resetType } = resetFlashcardProgressInFolderQueryDto;

    // Get all study sets in the folder
    const folder = await this.findOne({
      where: { id },
      relations: ['studySets', 'studySets.flashcards'],
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const studySets = folder.studySets;
    if (!studySets || studySets.length === 0) {
      throw new NotFoundException('Folder has no study sets');
    }

    // Reset progress of all flashcards in the study sets
    for (const studySet of studySets) {
      for (const flashcard of studySet.flashcards) {
        if (resetType === 'resetAll') {
          flashcard.rating = FlashcardStatusEnum.NOT_STUDIED;
          flashcard.flipStatus = FlipFlashcardStatus.NONE;
          flashcard.quizStatus = QuizFlashcardStatusEnum.NONE;
          flashcard.trueFalseStatus = TrueFalseStatusEnum.NONE;
          flashcard.writeStatus = WriteStatusEnum.NONE;
        } else if (resetType === 'flipStatus') {
          flashcard.flipStatus = FlipFlashcardStatus.NONE;
        } else if (resetType === 'rating') {
          flashcard.rating = FlashcardStatusEnum.NOT_STUDIED;
        } else if (resetType === 'quizStatus') {
          flashcard.quizStatus = QuizFlashcardStatusEnum.NONE;
        } else if (resetType === 'trueFalseStatus') {
          flashcard.trueFalseStatus = TrueFalseStatusEnum.NONE;
        } else if (resetType === 'writeStatus') {
          flashcard.writeStatus = WriteStatusEnum.NONE;
        }
        await this.dataSource.getRepository(FlashcardEntity).save(flashcard);
      }
    }

    return {
      message: 'Flashcard progress reset successfully',
      folderId: id,
    };
  }
}
