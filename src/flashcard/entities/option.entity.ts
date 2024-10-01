import { FlashcardEntity } from './flashcard.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('options')
export class OptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  answerText: string;

  @Column()
  isCorrect: boolean;

  @Column({ type: 'simple-array', nullable: true })
  imageURL: string[];

  @ManyToOne(() => FlashcardEntity, (flashcard) => flashcard.options, {
    onDelete: 'CASCADE',
  })
  flashcard: FlashcardEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
