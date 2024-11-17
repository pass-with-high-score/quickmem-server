import { UserEntity } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('study_time')
export class StudyTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.studyTimes)
  user: UserEntity;

  @Column('int')
  timeSpent: number;

  @Column('timestamp')
  date: Date;
}
