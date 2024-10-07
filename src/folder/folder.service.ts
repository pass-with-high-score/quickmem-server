import { Injectable } from '@nestjs/common';
import { FolderRepository } from './folder.repository';

@Injectable()
export class FolderService {
  constructor(private readonly folderRepository: FolderRepository) {}
}
