import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('flashcards')
export class FlashcardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
