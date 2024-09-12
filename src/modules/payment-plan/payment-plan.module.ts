import { Module } from '@nestjs/common';
import { PaymentPlanService } from './payment-plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { PaymentPlanController } from './payment-plan.controller';
import { PaymentPlan } from 'src/entities/payment-plan.entity';
import { Sale } from 'src/entities/sale.entity';
import { ReceivedTransaction } from 'src/entities/received-transaction.entity';
import { PaymentHistory } from 'src/entities/payment-history.entity';
import { PaymentPlanHistory } from 'src/entities/payment-plan-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentPlan, Sale, ReceivedTransaction, PaymentHistory, PaymentPlanHistory]),
    PaymentPlanModule,
  ],
  providers: [PaymentPlanService],
  controllers: [PaymentPlanController],
  exports: [PaymentPlanService],
})
export class PaymentPlanModule {}
