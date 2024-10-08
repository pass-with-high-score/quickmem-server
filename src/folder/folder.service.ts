import { Injectable } from '@nestjs/common';
import { FolderRepository } from './folder.repository';
import { CreateFolderDto } from './dto/create-folder.dto';
import { FolderResponseInterface } from './interfaces/folder-response.interface';
import { GetFoldersByOwnerIdDto } from './dto/get-folders-by-owner-id.dto';
import { GetFolderResponseInterface } from './interfaces/get-folder-response.interface';
import { GetFoldersByIdDto } from './dto/get-folders-by-id.dto';
import { AddStudySetsToFolderDto } from './dto/add-study-sets-to-folder.dto';
import { UpdateFolderByIdDto } from './dto/update-folder-by-id.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { RemoveStudySetsFromFolderDto } from './dto/remove-study-sets-from-folder.dto';
import { DeleteFolderByIdDto } from './dto/delete-folder-by-id.dto';
import { SearchFolderByTitleDto } from './dto/search-folder-by-title';

@Injectable()
export class FolderService {
  constructor(private readonly folderRepository: FolderRepository) {}

  async getFolderByUserId(
    getFoldersByUserIdDto: GetFoldersByOwnerIdDto,
  ): Promise<GetFolderResponseInterface[]> {
    return this.folderRepository.getFolderByOwnerId(getFoldersByUserIdDto);
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

  async addStudySetsToFolder(
    addStudySetsToFolderDto: AddStudySetsToFolderDto,
  ): Promise<GetFolderResponseInterface> {
    return this.folderRepository.addStudySetsToFolder(addStudySetsToFolderDto);
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

  async removeStudySetsFromFolder(
    removeStudySetsFromFolderDto: RemoveStudySetsFromFolderDto,
  ): Promise<GetFolderResponseInterface> {
    return this.folderRepository.removeStudySetsFromFolder(
      removeStudySetsFromFolderDto,
    );
  }

  async deleteFolder(deleteFolderByIdDto: DeleteFolderByIdDto): Promise<void> {
    return this.folderRepository.deleteFolder(deleteFolderByIdDto);
  }

  async searchFolderByTitle(
    searchFolderByTitleDto: SearchFolderByTitleDto,
  ): Promise<GetFolderResponseInterface[]> {
    return this.folderRepository.searchFolderByTitle(searchFolderByTitleDto);
  }
}
