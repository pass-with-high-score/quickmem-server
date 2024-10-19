import { IsNotEmpty } from 'class-validator';

export class JoinClassByLinkParamDto {
  @IsNotEmpty()
  studySetLinkCode: string;
}
