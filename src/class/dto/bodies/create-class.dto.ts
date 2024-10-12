import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateClassDto {
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

  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}
