import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FlashcardStatusEnum } from './flashcard-status.enum';
import { StudySetEntity } from '../../study-set/entities/study-set.entity';

@Entity('flashcards')
export class FlashcardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  term: string;

  @Column()
  definition: string;

  @Column({ nullable: true })
  definitionImageURL: string;

  @Column({ type: 'boolean', default: false })
  isStarred: boolean;

  @Column({ nullable: true })
  hint: string;

  @Column({ nullable: true })
  explanation: string;

  @ManyToOne(() => StudySetEntity, (studySet) => studySet.flashcards, {
    onDelete: 'CASCADE',
  })
  studySet: StudySetEntity;

  @Column({
    type: 'enum',
    enum: FlashcardStatusEnum,
    default: FlashcardStatusEnum.NOT_STUDIED,
  })
  rating: FlashcardStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
