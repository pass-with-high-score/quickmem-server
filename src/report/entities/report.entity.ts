import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { ReportEnum } from '../enums/report.enum';
import { ReportStatusEnum } from '../enums/report-status.enum';

@Entity('reports')
export class ReportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reason: string;

  @Column({
    type: 'enum',
    enum: ReportStatusEnum,
    enumName: 'report_status',
    default: ReportStatusEnum.PENDING,
  })
  status: ReportStatusEnum;

  @Column({ type: 'enum', enum: ReportEnum, enumName: 'report_enum' })
  reportedType: ReportEnum;

  @Column({ nullable: true })
  reportedEntityId: string;

  @ManyToOne(() => UserEntity, (user) => user.ownerOfReportedEntities)
  ownerOfReportedEntity: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.reports)
  reporter: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
