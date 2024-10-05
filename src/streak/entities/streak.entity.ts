import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';

@Entity('streaks')
export class StreakEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.streaks)
  user: UserEntity;

  @Column()
  streakCount: number;

  @CreateDateColumn()
  date: Date;
}
