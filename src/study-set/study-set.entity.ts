import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../auth/user.entity';
import { SubjectEntity } from './subject.entity';
import { ColorEntity } from './color.entity';

@Entity('study_set')
export class StudySetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description?: string;

  @ManyToOne(() => SubjectEntity, (subject) => subject.studySets)
  subject: SubjectEntity;

  @ManyToOne(() => ColorEntity, (color) => color.studySets)
  color: ColorEntity;

  @Column()
  isPublic: boolean;

  @ManyToOne(() => UserEntity, (user) => user.studySets)
  owner: UserEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
