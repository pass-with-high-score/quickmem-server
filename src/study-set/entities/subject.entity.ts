import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StudySetEntity } from './study-set.entity';

@Entity('subjects')
export class SubjectEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StudySetEntity, (studySet) => studySet.subject)
  studySets: StudySetEntity[];
}
