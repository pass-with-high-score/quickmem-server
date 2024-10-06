import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from '../enums/user-role.enum';
import { StudySetEntity } from '../../study-set/entities/study-set.entity';
import { AuthProviderEnum } from '../enums/auth-provider.enum';
import { FolderEntity } from '../../folder/entities/folder.entity';
import { ClassEntity } from '../../class/entities/class.entity';
import { ReportEntity } from '../../report/entities/report.entity';
import { StreakEntity } from '../../streak/entities/streak.entity';
import { NotificationEntity } from '../../notification/entities/notification.entity';
import { SubscriptionEntity } from '../../subscription/entities/subscription.entity';
import { DeviceEntity } from '../../firebase/entities/device.entity';

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
    type: 'enum',
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
    type: 'enum',
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

  @OneToMany(() => FolderEntity, (folder) => folder.owner)
  folders: FolderEntity[];

  @OneToMany(() => ClassEntity, (classEntity) => classEntity.owner)
  ownerClasses: ClassEntity[];

  @OneToMany(() => StreakEntity, (streak) => streak.user)
  streaks: StreakEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.user)
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => ReportEntity, (report) => report.reporter)
  reports: ReportEntity[];

  @OneToMany(() => DeviceEntity, (device) => device.user)
  devices: DeviceEntity[];

  @ManyToMany(() => ClassEntity, (classEntity) => classEntity.members)
  classes: ClassEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
