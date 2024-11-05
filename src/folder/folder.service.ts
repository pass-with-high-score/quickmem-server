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
import { SearchFolderByTitleDto } from './dto/queries/search-folder-by-title';
import { UpdateStudySetsInFolderResponseInterface } from './interfaces/update-study-sets-in-folder-response.interface';

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
    searchFolderByTitleDto: SearchFolderByTitleDto,
  ): Promise<GetFolderResponseInterface[]> {
    return this.folderRepository.searchFolderByTitle(searchFolderByTitleDto);
  }

  async updateStudySetsInFolder(
    updateStudySetsInFolderDto: UpdateStudySetsInFolderDto,
  ): Promise<UpdateStudySetsInFolderResponseInterface> {
    return this.folderRepository.updateStudySetsInFolder(
      updateStudySetsInFolderDto,
    );
  }
}
