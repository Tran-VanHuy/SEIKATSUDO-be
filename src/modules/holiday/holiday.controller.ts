import { Controller, Get, Param, Query } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { HolidayDto } from './dto/holiday.dto';
import { Dayjs } from 'dayjs';
import { CheckHolidayDto } from './dto/check-holiday.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Holidays")
@Controller('holidays')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get('/date-shipment')
  async getPayment(@Query() query: HolidayDto) {
    return this.holidayService.getShipAndDeliveryDate(query);
  }

  @Get('/date-plan')
  async getDatePlan(@Query() query: CheckHolidayDto) {
    return this.holidayService.checkWeekendAndHoliday(query);
  }
}
