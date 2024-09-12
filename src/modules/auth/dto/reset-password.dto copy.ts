import { IsNotEmpty, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ResetPasswordDto {
  @IsNotEmpty({ message: i18nValidationMessage('messages.auth.forgotPassword.error.emailRequired') })
  @Length(8, 255, { message: i18nValidationMessage('messages.auth.forgotPassword.error.maxLength') })
  password: string;

  @IsString()
  token: string;
}
