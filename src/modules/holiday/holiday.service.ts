import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from 'src/entities/holiday.entity';
import { HolidayDto } from './dto/holiday.dto';
import { dayOfWeek, numDayOrder } from '../../constants/holiday';
import dayjs, { Dayjs } from 'dayjs';
import { CheckHolidayDto } from './dto/check-holiday.dto';
import { NEXT_ONE_YEAR } from 'src/constants/constant';

@Injectable()
export class HolidayService extends BaseService {
  constructor(@InjectRepository(Holiday) private holidayRepo: Repository<Holiday>) {
    super();
  }

  async getShipAndDeliveryDate(query: HolidayDto) {
    const { orderDate, days } = query;
    const fromOrderDate = dayjs(orderDate);
    const holidays = await this.holidayRepo.find();
    let holidayFullDate = [] as string[];
    holidays.forEach((holiday: Holiday) => {
      holidayFullDate.push(dayjs(holiday.fulldate).format('YYYY-MM-DD'));
    });
    const shipDate = checkWeekendOfDatePlan(fromOrderDate, numDayOrder, holidayFullDate);
    const deliveryDate = dayjs(shipDate).add(days, 'day');

    return this.responseOk({ deliveryDate: deliveryDate, shipDate: shipDate });
  }

  async checkWeekendAndHoliday(query: CheckHolidayDto) {
    const dateInput = dayjs(query.checkDate);
    const yearCurrent = new Date().getFullYear();
    const nextYear = yearCurrent + NEXT_ONE_YEAR;
    const holidays = await this.holidayRepo
      .createQueryBuilder('H')
      .orWhere('H.year = :yearCurrent', { yearCurrent: yearCurrent })
      .orWhere('H.year = :nextYear', { nextYear: nextYear })
      .getMany();
    let holidayFullDate = [] as string[];
    holidays.forEach((holiday: Holiday) => {
      holidayFullDate.push(dayjs(holiday.fulldate).format('YYYY-MM-DD'));
    });

    const datePlan = this.checkHoliday(dateInput, holidayFullDate);
    return this.responseOk({ datePlan: datePlan });
  }

  checkHoliday(dateInput: Dayjs, holidayFullDate: string[]) {
    let count = 0;
    if (holidayFullDate.includes(dateInput.format('YYYY-MM-DD'))) {
      dateInput = dateInput.add(1, 'day');
      count++;
    }

    if (dateInput.day() === dayOfWeek.SATURDAY) {
      dateInput = dayjs(dateInput).add(2, 'day');
    } else if (dateInput.day() === dayOfWeek.SUNDAY) {
      dateInput = dayjs(dateInput).add(1, 'day');
    }

    if (count == 0) return dateInput;

    return this.checkHoliday(dateInput, holidayFullDate);
  }
}

function checkWeekendOfDatePlan(fromDate: Dayjs, numberOfDay: number, holidayFullDate: string[]) {
  let countWeekendDay = 0;
  const toDate = dayjs(fromDate).add(numberOfDay, 'day');
  for (let date = fromDate.add(1, 'day'); date <= toDate; date = date.add(1, 'day')) {
    if ([dayOfWeek.SATURDAY, dayOfWeek.SUNDAY].includes(date.day())) {
      countWeekendDay++;
      continue;
    }
    if (holidayFullDate.includes(date.format('YYYY-MM-DD'))) {
      countWeekendDay++;
    }
  }
  if (countWeekendDay === 0) return toDate;

  return checkWeekendOfDatePlan(toDate, countWeekendDay, holidayFullDate);
}
