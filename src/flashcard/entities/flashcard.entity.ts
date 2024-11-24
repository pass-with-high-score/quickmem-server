import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FlashcardStatusEnum } from '../enums/flashcard-status.enum';
import { StudySetEntity } from '../../study-set/entities/study-set.entity';
import { ImageEntity } from '../../cloudinary/entities/image.entity';
import { FlipFlashcardStatus } from '../enums/flip-flashcard-status';
import { QuizFlashcardStatusEnum } from '../enums/quiz-flashcard-status.enum';
import { TrueFalseStatusEnum } from '../enums/true-false-status.enum';
import { WriteStatusEnum } from '../enums/write-status.enum';

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
    enumName: 'flashcard_status_enum',
    enum: FlashcardStatusEnum,
    default: FlashcardStatusEnum.NOT_STUDIED,
  })
  rating: FlashcardStatusEnum;
  @Column({
    type: 'enum',
    enumName: 'flip_flashcard_status_enum',
    enum: FlipFlashcardStatus,
    default: FlipFlashcardStatus.NONE,
  })
  flipStatus: FlipFlashcardStatus;

  @Column({
    type: 'enum',
    enumName: 'true_false_flashcard_status_enum',
    enum: TrueFalseStatusEnum,
    default: TrueFalseStatusEnum.NONE,
  })
  trueFalseStatus: TrueFalseStatusEnum;

  @Column({
    type: 'enum',
    enumName: 'quiz_flashcard_status_enum',
    enum: QuizFlashcardStatusEnum,
    default: QuizFlashcardStatusEnum.NONE,
  })
  quizStatus: QuizFlashcardStatusEnum;

  @Column({
    type: 'enum',
    enumName: 'write_status_enum',
    enum: WriteStatusEnum,
    default: WriteStatusEnum.NONE,
  })
  writeStatus: WriteStatusEnum;

  @OneToOne(() => ImageEntity, (image) => image.flashcard, {
    onDelete: 'SET NULL',
  })
  image: ImageEntity;

  @Column({ nullable: true, default: false })
  isAIGenerated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
