import { IsNotEmpty } from 'class-validator';

export class GetUserDetailQueryDto {
  @IsNotEmpty()
  isOwner: boolean;
}
