import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { ClassEntity } from './class.entity';

@Entity('recent_classes')
export class RecentClassEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.recentClasses, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => ClassEntity, (classEntity) => classEntity.recentAccesses, {
    onDelete: 'CASCADE',
  })
  classEntity: ClassEntity;

  @CreateDateColumn()
  accessedAt: Date;
}
