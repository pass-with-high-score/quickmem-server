import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/bodies/create-folder.dto';
import { FolderResponseInterface } from './interfaces/folder-response.interface';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
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

@SkipThrottle()
@UseGuards(AuthGuard('jwt'))
@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async searchFolderByTitle(
    @Query() searchFoldersByTitleQueryDto: SearchFoldersByTitleQueryDto,
  ): Promise<GetFolderResponseInterface[]> {
    return this.folderService.searchFolderByTitle(searchFoldersByTitleQueryDto);
  }

  @Get('/link/:code')
  async getFolderByCode(
    @Param() getFolderByCodeParamDto: GetFolderByCodeParamDto,
  ): Promise<GetFolderResponseInterface> {
    return this.folderService.getFolderByCode(getFolderByCodeParamDto);
  }

  @Get('/owner/:ownerId')
  @HttpCode(HttpStatus.OK)
  async getFolderByOwnerId(
    @Param() getFoldersByOwnerIdDto: GetFoldersByOwnerIdDto,
    @Query() getFolderByOwnerIdQueryDto: GetFolderByOwnerIdQueryDto,
  ): Promise<GetFolderResponseInterface[]> {
    return this.folderService.getFolderByOwnerId(
      getFoldersByOwnerIdDto,
      getFolderByOwnerIdQueryDto,
    );
  }

  @Get('/recent/:userId')
  @HttpCode(HttpStatus.OK)
  async getRecentFoldersByUserId(
    @Param() getFoldersByUserIdDto: GetFoldersByUserIdDto,
  ): Promise<GetFolderResponseInterface[]> {
    return this.folderService.getRecentFoldersByUserId(getFoldersByUserIdDto);
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

  @Post('/study-sets')
  @HttpCode(HttpStatus.CREATED)
  async updateStudySetsInFolder(
    @Body() updateStudySetsInFolderDto: UpdateStudySetsInFolderDto,
  ): Promise<UpdateStudySetsInFolderResponseInterface> {
    return this.folderService.updateStudySetsInFolder(
      updateStudySetsInFolderDto,
    );
  }

  @Post('/recent')
  @HttpCode(HttpStatus.CREATED)
  async updateRecentFolder(
    @Body() updateRecentFolderBodyDto: UpdateRecentFolderBodyDto,
  ) {
    return this.folderService.updateRecentFolder(updateRecentFolderBodyDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFolder(
    @Body() createFolderDto: CreateFolderDto,
  ): Promise<FolderResponseInterface> {
    return this.folderService.createFolder(createFolderDto);
  }

  @Patch('/:id/reset-progress')
  @HttpCode(HttpStatus.OK)
  async resetFlashcardProgressInFolder(
    @Param()
    resetFlashcardProgressInFolderParamDto: ResetFlashcardProgressInFolderParamDto,
    @Query()
    resetFlashcardProgressInFolderQueryDto: ResetFlashcardProgressInFolderQueryDto,
  ): Promise<ResetFlashcardProgressResponseInterface> {
    return this.folderService.resetFlashcardProgressInFolder(
      resetFlashcardProgressInFolderParamDto,
      resetFlashcardProgressInFolderQueryDto,
    );
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFolder(
    @Param() deleteFolderByIdDto: DeleteFolderByIdDto,
  ): Promise<void> {
    return this.folderService.deleteFolder(deleteFolderByIdDto);
  }
}
