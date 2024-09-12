import { IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator';
import { ShippingCompany } from 'src/entities/shipping-company.entity';
import { Unique } from 'src/validator/is-unique';
import { MSG } from 'src/constants/constant';

export class CreateShippingCompanyDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty({ message: MSG.EMPTY })
  @MaxLength(40, { message: MSG.OVER_40_CHARACTERS })
  @Validate(Unique, [ShippingCompany, 'name'], { message: MSG.ERROR_UNIQUE })
  name: string;
}
