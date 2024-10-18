import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FlashcardEntity } from '../../flashcard/entities/flashcard.entity';

@Entity('flashcard_images')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @OneToMany(() => FlashcardEntity, (flashcard) => flashcard.image)
  flashcards: FlashcardEntity[];
}
