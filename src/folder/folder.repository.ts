import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FolderEntity } from './entities/folder.entity';

@Injectable()
export class FolderRepository extends Repository<FolderRepository> {
  constructor(private dataSource: DataSource) {
    super(FolderEntity, dataSource.createEntityManager());
  }
}
