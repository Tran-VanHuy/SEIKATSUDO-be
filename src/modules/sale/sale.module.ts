import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from 'src/entities/sale.entity';
import { SaleProduct } from 'src/entities/sale-product.entity';
import { Shipment } from 'src/entities/shipment.entity';
import { Payment } from 'src/entities/payment.entity';
import { HttpModule } from '@nestjs/axios';
import { PaymentHistory } from 'src/entities/payment-history.entity';
import { Product } from 'src/entities/product.entity';
import { Member } from 'src/entities/member.entity';
import { PaymentPlan } from 'src/entities/payment-plan.entity';
import { PaymentMethods } from 'src/entities/payment-method.entity';
import { ReceivedTransaction } from 'src/entities/received-transaction.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Sale,
      SaleProduct,
      Shipment,
      Payment,
      PaymentHistory,
      Product,
      Member,
      PaymentPlan,
      PaymentMethods,
      ReceivedTransaction,
    ]),
  ],
  providers: [SaleService],
  exports: [SaleService],
  controllers: [SaleController],
})
export class SaleModule {}
