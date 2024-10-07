import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderEntity } from './entities/folder.entity';
import { FolderRepository } from './folder.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FolderEntity])],
  providers: [FolderService, FolderRepository],
  controllers: [FolderController],
})
export class FolderModule {}
