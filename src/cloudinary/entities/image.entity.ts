import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FlashcardEntity } from '../../flashcard/entities/flashcard.entity';

@Entity('flashcard_images')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @OneToOne(() => FlashcardEntity, (flashcard) => flashcard.image, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'flashcard',
  })
  flashcard: FlashcardEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
