import { Injectable } from '@nestjs/common';
import { CreateStudyTimeDto } from './dto/bodies/create-study-time.dto';
import { StudyTimeRepository } from './study-time.repository';
import { CreateStudyTimeInterface } from './interfaces/create-study-time.interface';

@Injectable()
export class StudyTimeService {
  constructor(private readonly studyTimeRepository: StudyTimeRepository) {}

  async createStudyTime(
    createStudyTimeDto: CreateStudyTimeDto,
  ): Promise<CreateStudyTimeInterface> {
    return this.studyTimeRepository.createStudyTime(createStudyTimeDto);
  }
}
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StudyTimeEntity } from "./entities/study-time.entity";
import { Repository } from "typeorm";
import { UserEntity } from "src/auth/entities/user.entity";
import { CreateStudyTimeDto } from "./dto/create-study-time.dto";

@Injectable()
export class StudyTimeService {
  constructor(
    @InjectRepository(StudyTimeEntity)
    private readonly studyTimeRepository: Repository<StudyTimeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createStudyTime(createStudyTimeDto: CreateStudyTimeDto): Promise<StudyTimeEntity> {
    const { userId, timeSpent, date } = createStudyTimeDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    const studyTime = this.studyTimeRepository.create({
      user,
      timeSpent,
      date,
    });

    return this.studyTimeRepository.save(studyTime);
  }
}
