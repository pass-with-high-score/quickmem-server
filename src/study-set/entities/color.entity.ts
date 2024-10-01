import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StudySetEntity } from './study-set.entity';

@Entity('colors')
export class ColorEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  hexValue: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StudySetEntity, (studySet) => studySet.color)
  studySets: StudySetEntity[];
}
