import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';

@Module({
  providers: [FolderService],
  controllers: [FolderController],
})
export class FolderModule {}
