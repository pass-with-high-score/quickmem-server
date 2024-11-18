import { IsNotEmpty, IsString } from 'class-validator';

export class GetClassByJoinTokenParamDto {
  @IsString()
  @IsNotEmpty()
  joinToken: string;
}
