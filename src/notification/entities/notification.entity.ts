import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { NotificationTypeEnum } from '../enums/notification-type.enum';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationTypeEnum,
    default: NotificationTypeEnum.NONE,
  })
  notificationType: NotificationTypeEnum;

  @Column({ type: 'json', nullable: true })
  data: any;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
