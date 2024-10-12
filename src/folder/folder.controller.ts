import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/bodies/create-folder.dto';
import { FolderResponseInterface } from './interfaces/folder-response.interface';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { GetFoldersByOwnerIdDto } from './dto/params/get-folders-by-owner-id.dto';
import { GetFolderResponseInterface } from './interfaces/get-folder-response.interface';
import { GetFoldersByIdDto } from './dto/params/get-folders-by-id.dto';
import { AddStudySetsToFolderDto } from './dto/bodies/add-study-sets-to-folder.dto';
import { UpdateFolderByIdDto } from './dto/params/update-folder-by-id.dto';
import { UpdateFolderDto } from './dto/bodies/update-folder.dto';
import { RemoveStudySetsFromFolderDto } from './dto/bodies/remove-study-sets-from-folder.dto';
import { DeleteFolderByIdDto } from './dto/params/delete-folder-by-id.dto';
import { SearchFolderByTitleDto } from './dto/queries/search-folder-by-title';
import { LoggingInterceptor } from '../logging.interceptor';

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor)
@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async searchFolderByTitle(
    @Query() searchFolderByTitleDto: SearchFolderByTitleDto,
  ): Promise<GetFolderResponseInterface[]> {
    return this.folderService.searchFolderByTitle(searchFolderByTitleDto);
  }

  @Get('/owner/:ownerId')
  @HttpCode(HttpStatus.OK)
  async getFolderByOwnerId(
    @Param() getFoldersByOwnerIdDto: GetFoldersByOwnerIdDto,
  ): Promise<GetFolderResponseInterface[]> {
    return this.folderService.getFolderByUserId(getFoldersByOwnerIdDto);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getFolderById(
    @Param() getFoldersByIdDto: GetFoldersByIdDto,
  ): Promise<GetFolderResponseInterface> {
    return this.folderService.getFolderById(getFoldersByIdDto);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateFolder(
    @Param() updateFoldersByIdDto: UpdateFolderByIdDto,
    @Body() updateFolderDto: UpdateFolderDto,
  ): Promise<GetFolderResponseInterface> {
    return this.folderService.updateFolder(
      updateFoldersByIdDto,
      updateFolderDto,
    );
  }

  @Post('/add-study-sets')
  @HttpCode(HttpStatus.CREATED)
  async addStudySetsToFolder(
    @Body() addStudySetsToFolderDto: AddStudySetsToFolderDto,
  ): Promise<GetFolderResponseInterface> {
    return this.folderService.addStudySetsToFolder(addStudySetsToFolderDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFolder(
    @Body() createFolderDto: CreateFolderDto,
  ): Promise<FolderResponseInterface> {
    return this.folderService.createFolder(createFolderDto);
  }

  @Post('/remove-study-sets')
  @HttpCode(HttpStatus.OK)
  async removeStudySetsFromFolder(
    @Body() removeStudySetsFromFolderDto: RemoveStudySetsFromFolderDto,
  ): Promise<GetFolderResponseInterface> {
    return this.folderService.removeStudySetsFromFolder(
      removeStudySetsFromFolderDto,
    );
  }

  @Delete('/:id')
  async deleteFolder(
    @Param() deleteFolderByIdDto: DeleteFolderByIdDto,
  ): Promise<void> {
    return this.folderService.deleteFolder(deleteFolderByIdDto);
  }
}
