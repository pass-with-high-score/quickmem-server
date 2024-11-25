import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderEntity } from './entities/folder.entity';
import { FolderRepository } from './folder.repository';
import { RecentFolderEntity } from './entities/recent-folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FolderEntity, RecentFolderEntity])],
  providers: [FolderService, FolderRepository],
  controllers: [FolderController],
})
export class FolderModule {}
