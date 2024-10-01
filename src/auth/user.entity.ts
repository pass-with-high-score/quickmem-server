import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from './user-role.enum';
import { StudySetEntity } from '../study-set/entities/study-set.entity';
import { AuthProviderEnum } from './auth-provider.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpExpires: Date;

  @Column({ nullable: true })
  fullName: string;

  @Column()
  @Column({ nullable: true })
  avatarUrl: string;

  @Column({
    enum: UserRoleEnum,
    enumName: 'user_role_enum',
    default: UserRoleEnum.STUDENT,
  })
  role: UserRoleEnum;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ default: false, nullable: true })
  isVerified?: boolean;

  @Column({
    enum: AuthProviderEnum,
    enumName: 'auth_provider_enum',
    default: AuthProviderEnum.EMAIL,
  })
  provider: AuthProviderEnum;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @OneToMany(() => StudySetEntity, (studySet) => studySet.owner)
  studySets: StudySetEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
