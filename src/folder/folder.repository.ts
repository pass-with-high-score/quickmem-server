import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { FolderEntity } from './entities/folder.entity';
import { CreateFolderDto } from './dto/bodies/create-folder.dto';
import { FolderResponseInterface } from './interfaces/folder-response.interface';
import { UserEntity } from '../auth/entities/user.entity';
import { GetFoldersByOwnerIdDto } from './dto/params/get-folders-by-owner-id.dto';
import { GetFolderResponseInterface } from './interfaces/get-folder-response.interface';
import { GetFoldersByIdDto } from './dto/params/get-folders-by-id.dto';
import { AddStudySetsToFolderDto } from './dto/bodies/add-study-sets-to-folder.dto';
import { StudySetEntity } from '../study-set/entities/study-set.entity';
import { UpdateFolderDto } from './dto/bodies/update-folder.dto';
import { UpdateFolderByIdDto } from './dto/params/update-folder-by-id.dto';
import { RemoveStudySetsFromFolderDto } from './dto/bodies/remove-study-sets-from-folder.dto';
import { DeleteFolderByIdDto } from './dto/params/delete-folder-by-id.dto';
import { SearchFolderByTitleDto } from './dto/queries/search-folder-by-title';

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

    try {
      await this.save(folder);
      return {
        id: folder.id,
        title: folder.title,
        description: folder.description,
        isPublic: folder.isPublic,
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
        relations: ['owner', 'studySets.owner', 'studySets.flashcards'],
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
  ): Promise<GetFolderResponseInterface[]> {
    const { ownerId } = getFoldersByOwnerIdDto;
    try {
      const folders = await this.find({
        where: { owner: { id: ownerId } },
        relations: ['owner', 'studySets'],
      });

      if (!folders.length) {
        throw new NotFoundException('No folders found for the user');
      }

      return Promise.all(
        folders.map((folder) =>
          this.mapFolderToGetFolderResponseInterface(folder, false),
        ),
      );
    } catch (error) {
      console.error('Error fetching folders by user ID:', error);
      throw new NotFoundException('Error fetching folders by user ID');
    }
  }

  async mapFolderToGetFolderResponseInterface(
    folder: FolderEntity,
    showFlashcards = false,
  ): Promise<GetFolderResponseInterface> {
    return {
      id: folder.id,
      title: folder.title,
      description: folder.description,
      isPublic: folder.isPublic,
      studySetCount: folder.studySets.length,
      ownerId: folder.owner.id,
      user: {
        id: folder.owner.id,
        username: folder.owner.username,
        avatarUrl: `${process.env.HOST}/public/images/avatar/${folder.owner.avatarUrl}.jpg`,
        role: folder.owner.role,
      },
      studySets: showFlashcards
        ? folder.studySets.map((studySet) => ({
            id: studySet.id,
            title: studySet.title,
            flashcardCount: studySet.flashcards.length,
            owner: {
              id: studySet.owner.id,
              username: studySet.owner.username,
              avatarUrl: studySet.owner.avatarUrl,
              role: studySet.owner.role,
            },
          }))
        : [],
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    };
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
      return this.mapFolderToGetFolderResponseInterface(folder, true);
    } catch (error) {
      console.error('Error updating folder:', error);
      throw new Error('Error updating folder');
    }
  }

  async addStudySetsToFolder(
    addStudySetsToFolderDto: AddStudySetsToFolderDto,
  ): Promise<GetFolderResponseInterface> {
    const { folderId, studySetIds } = addStudySetsToFolderDto;

    const folder = await this.findOne({
      where: { id: folderId },
      relations: ['studySets', 'studySets.owner', 'owner'],
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const studySets = await this.dataSource.getRepository(StudySetEntity).find({
      where: { id: In(studySetIds) },
      relations: ['owner', 'flashcards', 'folders'],
    });

    if (studySets.length !== studySetIds.length) {
      throw new NotFoundException('One or more study sets not found');
    }

    if (studySets.some((studySet) => studySet.owner.id !== folder.owner.id)) {
      throw new NotFoundException(
        'One or more study sets do not belong to user',
      );
    }

    if (
      studySets.some((studySet) =>
        studySet.folders.some((f) => f.id === folder.id),
      )
    ) {
      throw new NotFoundException('One or more study sets already in folder');
    }

    folder.studySets = [
      ...folder.studySets,
      ...studySets.filter(
        (studySet) =>
          !folder.studySets.some(
            (existingSet) => existingSet.id === studySet.id,
          ),
      ),
    ];

    await this.save(folder);

    return this.mapFolderToGetFolderResponseInterface(folder, true);
  }

  async removeStudySetsFromFolder(
    removeStudySetsFromFolderDto: RemoveStudySetsFromFolderDto,
  ): Promise<GetFolderResponseInterface> {
    const { folderId, studySetIds } = removeStudySetsFromFolderDto;

    const folder = await this.findOne({
      where: { id: folderId },
      relations: [
        'studySets',
        'studySets.owner',
        'owner',
        'studySets.flashcards',
      ],
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const studySetsToRemove = folder.studySets.filter((set) =>
      studySetIds.includes(set.id),
    );

    if (studySetsToRemove.length !== studySetIds.length) {
      throw new NotFoundException('One or more study sets not found in folder');
    }

    folder.studySets = folder.studySets.filter(
      (set) => !studySetIds.includes(set.id),
    );

    await this.save(folder);

    return this.mapFolderToGetFolderResponseInterface(folder, true);
  }

  async deleteFolder(deleteFolderByIdDto: DeleteFolderByIdDto): Promise<void> {
    const { id } = deleteFolderByIdDto;
    const folder = await this.findOne({ where: { id } });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    await this.remove(folder);
    throw new NotFoundException('Folder deleted successfully');
  }

  async searchFolderByTitle(
    searchFolderByTitleDto: SearchFolderByTitleDto,
  ): Promise<GetFolderResponseInterface[]> {
    const { title, size = 40, page = 0 } = searchFolderByTitleDto;

    const [folders, total] = await this.findAndCount({
      where: { title: ILike(`%${title}%`), isPublic: true },
      relations: [
        'owner',
        'studySets',
        'studySets.owner',
        'studySets.flashcards',
      ],
      take: size,
      skip: page * size,
    });
    console.log(total);

    if (!folders.length) {
      throw new NotFoundException('No folders found with the given title');
    }

    return Promise.all(
      folders.map((folder) =>
        this.mapFolderToGetFolderResponseInterface(folder, true),
      ),
    );
  }
}
