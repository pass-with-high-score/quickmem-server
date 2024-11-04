import { IsBoolean, IsNotEmpty } from 'class-validator';

export class GetUserDetailBodyDto {
  @IsBoolean()
  @IsNotEmpty()
  isOwner: boolean;
}
