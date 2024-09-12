import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CheckExpireTokenDto {
  @IsNotEmpty()
  token: string;
}
