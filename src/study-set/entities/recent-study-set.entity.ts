import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { StudySetEntity } from './study-set.entity';

@Entity('recent_study_sets')
export class RecentStudySetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.recentStudySets, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => StudySetEntity, (studySet) => studySet.recentAccesses, {
    onDelete: 'CASCADE',
  })
  studySet: StudySetEntity;

  @CreateDateColumn()
  accessedAt: Date;
}
