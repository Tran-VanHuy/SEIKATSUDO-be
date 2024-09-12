import { Module } from '@nestjs/common';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from 'src/entities/holiday.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Holiday])],
  controllers: [HolidayController],
  providers: [HolidayService],
})
export class HolidayModule {}
