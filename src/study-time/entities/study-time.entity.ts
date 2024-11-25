import { UserEntity } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LearnModeEnum } from '../../flashcard/enums/learn-mode.enum';
import { StudySetEntity } from '../../study-set/entities/study-set.entity';

@Entity('study_time')
export class StudyTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.studyTimes)
  user: UserEntity;

  @ManyToOne(() => StudySetEntity, (studySet) => studySet.studyTimes, {
    onDelete: 'CASCADE',
  })
  studySet: StudySetEntity;

  @Column('int')
  timeSpent: number;

  @Column({
    type: 'enum',
    enum: LearnModeEnum,
    nullable: true,
  })
  learnMode: LearnModeEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
