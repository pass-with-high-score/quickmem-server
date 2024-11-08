import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateIsReadBodyDto {
  @IsNotEmpty()
  @IsBoolean()
  isRead: boolean;
}
