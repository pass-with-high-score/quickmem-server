import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OptionEntity } from './option.entity';
import { Rating } from './rating.enum';
import { StudySetEntity } from '../study-set/study-set.entity';

@Entity('flashcards')
export class FlashcardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  question: string;
  @Column()
  answer: string;
  @Column({ type: 'simple-array', nullable: true })
  imageURL: string[];
  @Column({ nullable: true })
  hint: string;
  @Column({ nullable: true })
  explanation: string;
  @OneToMany(() => OptionEntity, (option) => option.flashcard, {
    cascade: true,
  })
  @ManyToOne(() => StudySetEntity, (studySet) => studySet.flashcards, {
    onDelete: 'CASCADE',
  })
  @ManyToMany(() => StudySetEntity, (studySet) => studySet.flashcards, {
    nullable: true,
  })
  studySets: StudySetEntity[];
  studySet: StudySetEntity;
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
