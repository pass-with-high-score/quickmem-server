import { Injectable } from '@nestjs/common';
import { FolderRepository } from './folder.repository';
import { CreateFolderDto } from './dto/bodies/create-folder.dto';
import { FolderResponseInterface } from './interfaces/folder-response.interface';
import { GetFoldersByOwnerIdDto } from './dto/params/get-folders-by-owner-id.dto';
import { GetFolderResponseInterface } from './interfaces/get-folder-response.interface';
import { GetFoldersByIdDto } from './dto/params/get-folders-by-id.dto';
import { UpdateStudySetsInFolderDto } from './dto/bodies/update-study-sets-in-folder.dto';
import { UpdateFolderByIdDto } from './dto/params/update-folder-by-id.dto';
import { UpdateFolderDto } from './dto/bodies/update-folder.dto';
import { DeleteFolderByIdDto } from './dto/params/delete-folder-by-id.dto';
import { SearchFoldersByTitleQueryDto } from './dto/queries/search-folders-by-title-query.dto';
import { UpdateStudySetsInFolderResponseInterface } from './interfaces/update-study-sets-in-folder-response.interface';
import { GetFolderByOwnerIdQueryDto } from './dto/queries/get-folder-by-owner-Id-query.dto';
import { GetFolderByCodeParamDto } from './dto/params/get-folder-by-code.param.dto';
import { UpdateRecentFolderBodyDto } from './dto/bodies/update-recent-folder-body.dto';
import { GetFoldersByUserIdDto } from './dto/params/get-folders-by-user-Id.dto';
import { ResetFlashcardProgressInFolderParamDto } from './dto/params/reset-flashcard-progress-in-folder-param.dto';
import { ResetFlashcardProgressInFolderQueryDto } from './dto/queries/reset-flashcard-progress-in-folder-query.dto';
import { ResetFlashcardProgressResponseInterface } from '../study-set/interfaces/reset-flashcard-progress-response.interface';

@Injectable()
export class FolderService {
  constructor(private readonly folderRepository: FolderRepository) {}

  async getFolderByOwnerId(
    getFoldersByOwnerIdDto: GetFoldersByOwnerIdDto,
    getFolderByOwnerIdQueryDto: GetFolderByOwnerIdQueryDto,
  ): Promise<GetFolderResponseInterface[]> {
    return this.folderRepository.getFolderByOwnerId(
      getFoldersByOwnerIdDto,
      getFolderByOwnerIdQueryDto,
    );
  }

  async createFolder(
    createFolderDto: CreateFolderDto,
  ): Promise<FolderResponseInterface> {
    return this.folderRepository.createFolder(createFolderDto);
  }

  async getFolderById(
    getFoldersByIdDto: GetFoldersByIdDto,
  ): Promise<GetFolderResponseInterface> {
    return this.folderRepository.getFolderById(getFoldersByIdDto);
  }

  async updateFolder(
    updateFoldersByIdDto: UpdateFolderByIdDto,
    updateFolderDto: UpdateFolderDto,
  ): Promise<GetFolderResponseInterface> {
    return this.folderRepository.updateFolder(
      updateFoldersByIdDto,
      updateFolderDto,
    );
  }

  async deleteFolder(deleteFolderByIdDto: DeleteFolderByIdDto): Promise<void> {
    return this.folderRepository.deleteFolder(deleteFolderByIdDto);
  }

  async searchFolderByTitle(
    searchFoldersByTitleQueryDto: SearchFoldersByTitleQueryDto,
  ): Promise<GetFolderResponseInterface[]> {
    return this.folderRepository.searchFolderByTitle(
      searchFoldersByTitleQueryDto,
    );
  }

  async updateStudySetsInFolder(
    updateStudySetsInFolderDto: UpdateStudySetsInFolderDto,
  ): Promise<UpdateStudySetsInFolderResponseInterface> {
    return this.folderRepository.updateStudySetsInFolder(
      updateStudySetsInFolderDto,
    );
  }

  async getFolderByCode(
    getFolderByCodeParamDto: GetFolderByCodeParamDto,
  ): Promise<GetFolderResponseInterface> {
    return this.folderRepository.getFolderByCode(getFolderByCodeParamDto);
  }

  async updateRecentFolder(
    updateRecentFolderBodyDto: UpdateRecentFolderBodyDto,
  ) {
    return this.folderRepository.updateRecentFolder(updateRecentFolderBodyDto);
  }

  async getRecentFoldersByUserId(
    getFoldersByUserIdDto: GetFoldersByUserIdDto,
  ): Promise<GetFolderResponseInterface[]> {
    return this.folderRepository.getRecentFoldersByUserId(
      getFoldersByUserIdDto,
    );
  }

  async resetFlashcardProgressInFolder(
    resetFlashcardProgressInFolderParamDto: ResetFlashcardProgressInFolderParamDto,
    resetFlashcardProgressInFolderQueryDto: ResetFlashcardProgressInFolderQueryDto,
  ): Promise<ResetFlashcardProgressResponseInterface> {
    return this.folderRepository.resetFlashcardProgressInFolder(
      resetFlashcardProgressInFolderParamDto,
      resetFlashcardProgressInFolderQueryDto,
    );
  }
}
