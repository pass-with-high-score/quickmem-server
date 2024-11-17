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

@Entity('study_time')
export class StudyTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.studyTimes)
  user: UserEntity;

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
