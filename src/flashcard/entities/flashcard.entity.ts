import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OptionEntity } from './option.entity';
import { Rating } from './rating.enum';
import { StudySetEntity } from '../../study-set/entities/study-set.entity';

@Entity('flashcards')
export class FlashcardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column({ type: 'simple-array', nullable: true })
  questionImageURL: string[];

  @Column()
  answer: string;

  @Column({ type: 'simple-array', nullable: true })
  answerImageURL: string[];

  @Column({ nullable: true })
  hint: string;

  @Column({ nullable: true })
  explanation: string;

  @ManyToOne(() => StudySetEntity, (studySet) => studySet.flashcards, {
    onDelete: 'CASCADE',
  })
  studySet: StudySetEntity;

  @OneToMany(() => OptionEntity, (option) => option.flashcard, {
    cascade: true,
  })
  options: OptionEntity[];

  @Column({
    type: 'enum',
    enum: Rating,
    default: Rating.UNRATED,
  })
  rating: Rating;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
