import { Injectable } from '@nestjs/common';
import { ClassRepository } from './class.repository';

@Injectable()
export class ClassService {
  constructor(private readonly classRepository: ClassRepository) {}
}
