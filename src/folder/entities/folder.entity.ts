import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { ClassEntity } from '../../class/entities/class.entity';
import { StudySetEntity } from '../../study-set/entities/study-set.entity';
import { RecentFolderEntity } from './recent-folder.entity';

@Entity('folders')
export class FolderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @ManyToOne(() => UserEntity, (user) => user.folders)
  owner: UserEntity;

  @Column({ nullable: true })
  link: string;

  @ManyToMany(() => ClassEntity, (classEntity) => classEntity.folders)
  @JoinTable({
    name: 'class_folders',
    joinColumn: { name: 'folder_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'class_id', referencedColumnName: 'id' },
  })
  classes: ClassEntity[];

  @ManyToMany(() => StudySetEntity, (studySet) => studySet.folders)
  studySets: StudySetEntity[];

  @OneToMany(() => RecentFolderEntity, (recentFolder) => recentFolder.folder)
  recentAccesses: RecentFolderEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
