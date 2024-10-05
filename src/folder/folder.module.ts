import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderEntity } from './entities/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FolderEntity])],
  providers: [FolderService],
  controllers: [FolderController],
})
export class FolderModule {}
