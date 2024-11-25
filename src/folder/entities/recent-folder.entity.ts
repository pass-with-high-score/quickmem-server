import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { FolderEntity } from './folder.entity';

@Entity('recent_folders')
export class RecentFolderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.recentFolders, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => FolderEntity, (folder) => folder.recentAccesses, {
    onDelete: 'CASCADE',
  })
  folder: FolderEntity;

  @CreateDateColumn()
  accessedAt: Date;
}
