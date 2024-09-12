import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentPlan } from 'src/entities/payment-plan.entity';
import { Sale } from 'src/entities/sale.entity';
import { ReceivedTransaction } from 'src/entities/received-transaction.entity';
import { Member } from 'src/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, PaymentPlan, Sale, ReceivedTransaction, Member]), PaymentModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
