import { Module } from '@nestjs/common';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodService } from './payment-method.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethods } from 'src/entities/payment-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethods])],
  providers: [PaymentMethodService],
  exports: [PaymentMethodService],
  controllers: [PaymentMethodController],
})
export class PaymentMethodModule {}
