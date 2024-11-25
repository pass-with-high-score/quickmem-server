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
import { SubjectEntity } from './subject.entity';
import { ColorEntity } from './color.entity';
import { FlashcardEntity } from '../../flashcard/entities/flashcard.entity';
import { ClassEntity } from '../../class/entities/class.entity';
import { FolderEntity } from '../../folder/entities/folder.entity';
import { StudyTimeEntity } from '../../study-time/entities/study-time.entity';
import { RecentStudySetEntity } from './recent-study-set.entity';

@Entity('study_sets')
export class StudySetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description?: string;

  @ManyToOne(() => SubjectEntity, (subject) => subject.studySets)
  subject: SubjectEntity;

  @ManyToOne(() => ColorEntity, (color) => color.studySets)
  color: ColorEntity;

  @OneToMany(() => FlashcardEntity, (flashcard) => flashcard.studySet)
  flashcards: FlashcardEntity[];

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @ManyToOne(() => UserEntity, (user) => user.studySets)
  owner: UserEntity;

  @ManyToMany(() => ClassEntity, (classEntity) => classEntity.studySets)
  @JoinTable({
    name: 'class_study_sets',
    joinColumn: { name: 'study_set_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'class_id', referencedColumnName: 'id' },
  })
  classes: ClassEntity[];

  @ManyToMany(() => FolderEntity, (folder) => folder.studySets)
  @JoinTable({
    name: 'folder_study_sets',
    joinColumn: { name: 'study_set_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'folder_id', referencedColumnName: 'id' },
  })
  folders: FolderEntity[];

  @OneToMany(() => StudyTimeEntity, (studyTime) => studyTime.studySet)
  studyTimes: StudyTimeEntity[];

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true, default: false })
  isAIGenerated: boolean;

  @OneToMany(
    () => RecentStudySetEntity,
    (recentStudySet) => recentStudySet.studySet,
  )
  recentAccesses: RecentStudySetEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
