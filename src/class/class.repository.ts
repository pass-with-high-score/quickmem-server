import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ClassEntity } from './entities/class.entity';

@Injectable()
export class ClassRepository extends Repository<ClassEntity> {
  constructor(private dataSource: DataSource) {
    super(ClassEntity, dataSource.createEntityManager());
  }
}
