import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudySetEntity } from '../../study-set/entities/study-set.entity';
import { AuthProviderEnum } from '../enums/auth-provider.enum';
import { FolderEntity } from '../../folder/entities/folder.entity';
import { ReportEntity } from '../../report/entities/report.entity';
import { StreakEntity } from '../../streak/entities/streak.entity';
import { NotificationEntity } from '../../notification/entities/notification.entity';
import { SubscriptionEntity } from '../../subscription/entities/subscription.entity';
import { DeviceEntity } from '../../firebase/entities/device.entity';
import { StudyTimeEntity } from '../../study-time/entities/study-time.entity';
import { RecentStudySetEntity } from '../../study-set/entities/recent-study-set.entity';
import { RecentFolderEntity } from '../../folder/entities/recent-folder.entity';
import { UserStatusEnum } from '../enums/user-status.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  tempEmail: string;

  @Column({ nullable: true })
  tokenTempEmail: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpExpires: Date;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ default: false, nullable: true })
  isVerified?: boolean;

  @Column({
    type: 'simple-array',
    default: AuthProviderEnum.EMAIL,
  })
  provider: AuthProviderEnum[];

  @Column({ nullable: true })
  googleToken?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  lastReminderSentAt: Date;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @OneToMany(() => StudyTimeEntity, (studyTime) => studyTime.user)
  studyTimes: StudyTimeEntity[];

  @OneToMany(() => StudySetEntity, (studySet) => studySet.owner)
  studySets: StudySetEntity[];

  @OneToMany(() => FolderEntity, (folder) => folder.owner)
  folders: FolderEntity[];

  @Column({ type: 'int', default: 5 })
  coins: number;

  @OneToMany(() => StreakEntity, (streak) => streak.user)
  streaks: StreakEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.user)
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => ReportEntity, (report) => report.reporter)
  reports: ReportEntity[];

  @OneToMany(() => ReportEntity, (report) => report.ownerOfReportedEntity)
  ownerOfReportedEntities: ReportEntity[];

  @OneToMany(() => DeviceEntity, (device) => device.user)
  devices: DeviceEntity[];

  @OneToMany(
    () => RecentStudySetEntity,
    (recentStudySet) => recentStudySet.user,
  )
  recentStudySets: RecentStudySetEntity[];

  @OneToMany(() => RecentFolderEntity, (recentFolder) => recentFolder.user)
  recentFolders: RecentFolderEntity[];

  @Column({ nullable: true })
  emailChangedAt: Date;

  @Column({
    enum: UserStatusEnum,
    enumName: 'user_status_enum',
    default: UserStatusEnum.ACTIVE,
  })
  userStatus: UserStatusEnum;

  @Column({ nullable: true })
  bannedReason: string;

  @Column({ nullable: true })
  bannedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
