import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetReporterIdParamDto {
  @IsUUID()
  @IsNotEmpty()
  id: string
}
