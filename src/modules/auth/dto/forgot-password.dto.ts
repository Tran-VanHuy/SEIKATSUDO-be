import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Member } from 'src/entities/member.entity';
import { Exist } from 'src/validator/is-exist';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: i18nValidationMessage('messages.auth.forgotPassword.error.emailRequired') })
  @IsEmail({}, { message: i18nValidationMessage('messages.auth.forgotPassword.error.isEmail') })
  @Validate(Exist, [Member, 'email'], {
    message: i18nValidationMessage('messages.auth.forgotPassword.error.existEmail'),
  })
  email: string;
}
