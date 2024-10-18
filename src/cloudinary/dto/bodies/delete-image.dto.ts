import { IsNotEmpty, IsUrl } from 'class-validator';

export class DeleteImageDto {
  @IsNotEmpty()
  @IsUrl()
  imageURL: string;
}
