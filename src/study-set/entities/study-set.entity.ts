import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/user.entity';
import { SubjectEntity } from './subject.entity';
import { ColorEntity } from './color.entity';
import { FlashcardEntity } from '../../flashcard/entities/flashcard.entity';
import { TagEntity } from '../../flashcard/entities/tag.entity';

@Entity('study_sets')
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

  @OneToMany(() => FlashcardEntity, (flashcard) => flashcard.studySet)
  flashcards: FlashcardEntity[];

  @Column()
  isPublic: boolean;

  @ManyToOne(() => UserEntity, (user) => user.studySets)
  owner: UserEntity;

  @ManyToMany(() => TagEntity)
  @JoinTable()
  tags: TagEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
