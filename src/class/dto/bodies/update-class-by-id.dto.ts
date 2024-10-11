import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateClassByIdDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  allowSetAndMemberManagement: boolean;

  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}
