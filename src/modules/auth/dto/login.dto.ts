import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  staffcode: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
