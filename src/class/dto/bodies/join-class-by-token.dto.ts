import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class JoinClassByTokenDto {
  @IsNotEmpty()
  @IsString()
  joinToken: string;

  @IsNotEmpty()
  @IsUUID()
  classId: string;
}
