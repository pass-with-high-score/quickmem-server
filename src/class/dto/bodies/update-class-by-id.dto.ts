import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateClassByIdDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  allowSetManagement: boolean;

  @IsBoolean()
  allowMemberManagement: boolean;
}
