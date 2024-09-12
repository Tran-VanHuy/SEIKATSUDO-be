import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSourceOptions from '../../../ormconfig';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { constants } from 'src/constants/constant';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { PaymentModule } from '../payment/payment.module';
import { CustomerModule } from '../customer/customer.module';
import { MemberModule } from '../member/member.module';
import { ProductModule } from '../product/product.module';
import { PaymentPlanModule } from '../payment-plan/payment-plan.module';
import { SaleModule } from '../sale/sale.module';
import { HolidayModule } from '../holiday/holiday.module';
import { CategoryKikkakeModule } from '../category-kikkake/category-kikkake.module';
import { ProductKikkakeModule } from '../product-kikkake/product-kikkake.module';
import { ProductTypeModule } from '../product-type/product-type.module';
import { ProductSetModule } from '../product-set/product-set.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';
import { ProductCategoryModule } from '../product-category/product-category.module';
import { ShippingCompanyModule } from '../shipping-company/shipping-company.module';
import { AreaShipmentModule } from '../area-shipment/area-shipment.module';
import { PaymentMethodModule } from '../payment-method/payment-method.module';
import { SettingCustomerModule } from '../setting-customer/setting-customer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    RouterModule.register([
      {
        path: constants.ROUTER.ADMIN,
        module: AdminModule,
        children: [],
      },
    ]),
    I18nModule.forRoot({
      fallbackLanguage: 'jp',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-lang'])],
    }),
    AuthModule,
    PaymentModule,
    CustomerModule,
    MemberModule,
    ProductModule,
    PaymentPlanModule,
    SaleModule,
    HolidayModule,
    CategoryKikkakeModule,
    ProductKikkakeModule,
    ProductTypeModule,
    ProductSetModule,
    ProductCategoryModule,
    ShippingCompanyModule,
    AreaShipmentModule,
    PaymentMethodModule,
    SettingCustomerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
