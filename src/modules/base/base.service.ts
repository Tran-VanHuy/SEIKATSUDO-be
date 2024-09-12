import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from 'src/decorators/response';
import { SelectQueryBuilder } from 'typeorm';
import { PagingResponse } from 'src/modules/base/dto/paging.dto';

@Injectable()
export class BaseService {
  protected readonly logger = new Logger();
  // implement base service here
  responseOk(data: any = null, msg: string = null): any {
    return new ResponseDto(200, msg, data);
  }

  async customPaginate<T>(queryBuilder: SelectQueryBuilder<T>, rowsPerPage: number, currentPage: number) {
    const result = await queryBuilder
      .skip(currentPage * rowsPerPage - rowsPerPage)
      .take(rowsPerPage)
      .getManyAndCount();
    const items = result[0];
    const totalItems = result[1];
    const totalPage = Math.ceil(totalItems / rowsPerPage);

    return new PagingResponse(items, totalItems, items.length, rowsPerPage, totalPage, currentPage);
  }
}
