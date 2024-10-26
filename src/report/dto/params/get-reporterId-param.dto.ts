import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetReporterIdParamDto {
  @IsUUID()
  @IsNotEmpty()
  reporterId: string
}
