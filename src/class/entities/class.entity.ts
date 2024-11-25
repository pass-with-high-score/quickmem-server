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
import { FolderEntity } from '../../folder/entities/folder.entity';
import { StudySetEntity } from '../../study-set/entities/study-set.entity';
import { RecentClassEntity } from './recent-class.entity';

@Entity('classes')
export class ClassEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  allowSetManagement: boolean;

  @Column({ type: 'boolean', default: true })
  allowMemberManagement: boolean;

  @ManyToOne(() => UserEntity, (user) => user.ownerClasses)
  owner: UserEntity;

  @ManyToMany(() => FolderEntity, (folder) => folder.classes, {
    onDelete: 'CASCADE',
  })
  folders: FolderEntity[];

  @ManyToMany(() => StudySetEntity, (studySet) => studySet.classes, {
    onDelete: 'CASCADE',
  })
  studySets: StudySetEntity[];

  @ManyToMany(() => UserEntity, (user) => user.classes, {
    cascade: true,
  })
  @JoinTable({
    name: 'class_members',
    joinColumn: { name: 'class_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  members: UserEntity[];

  @Column()
  joinToken: string;

  @OneToMany(() => RecentClassEntity, (recentClass) => recentClass.classEntity)
  recentAccesses: RecentClassEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
