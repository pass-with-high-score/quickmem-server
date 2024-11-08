import { IsNotEmpty, IsUUID } from 'class-validator';

export class RegisterDeviceTokenBodyDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  deviceToken: string;
}
