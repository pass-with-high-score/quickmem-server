import { IsNotEmpty } from 'class-validator';

export class RegisterDeviceTokenBodyDto {
  @IsNotEmpty()
  deviceToken: string;
}
