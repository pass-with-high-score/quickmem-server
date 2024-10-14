import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { SubscriptionTypeEnum } from '../enums/subscription.enum';

@Entity('subscriptions')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.subscriptions)
  user: UserEntity;

  @Column({ type: 'boolean', default: false })
  isTrial: boolean;

  @Column({
    type: 'enum',
    enum: SubscriptionTypeEnum,
    nullable: true,
    enumName: 'trial_for_type_enum',
  })
  trialForType: string;

  @Column({
    type: 'enum',
    enum: SubscriptionTypeEnum,
    default: SubscriptionTypeEnum.FREE_TRIAL,
    enumName: 'subscription_type_enum',
  })
  subscriptionType: SubscriptionTypeEnum;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: true })
  isAutoRenew: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
