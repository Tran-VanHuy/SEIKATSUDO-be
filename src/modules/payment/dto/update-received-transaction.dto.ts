import { IsNumber, Validate } from 'class-validator';
import { Exist } from 'src/validator/is-exist';
import { CreateReceivedTransaction } from './create-payment.dto';
import { ReceivedTransaction } from 'src/entities/received-transaction.entity';

export class UpdateReceivedTransaction extends CreateReceivedTransaction {
  @IsNumber()
  @Validate(Exist, [ReceivedTransaction, 'id'])
  transactionId: number;
}
