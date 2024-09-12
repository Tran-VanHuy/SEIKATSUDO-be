import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  currentPage: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  rowsPerPage: number;
}

export class Paging {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;

  constructor(totalItems: number, itemCount: number, itemsPerPage: number, totalPages: number, currentPage: number) {
    this.totalItems = totalItems;
    this.itemCount = itemCount;
    this.itemsPerPage = itemsPerPage;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
  }
}

export class PagingResponse<T> {
  items: T[];
  meta: Paging;

  constructor(
    items: T[],
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number,
  ) {
    this.items = items;
    this.meta = new Paging(totalItems, itemCount, itemsPerPage, totalPages, currentPage);
  }
}
