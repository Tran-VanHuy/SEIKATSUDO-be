import { Controller, Get, Post, Query, Body, Param, Delete, Put, UseGuards, Header } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleTransaction } from './dto/request.dto/create.dto';
import { ZipCodeDto } from './dto/request.dto/zip-code.dto';
import { ResListSaleDto } from './dto/response.dto/res.list.dto';
import { ReqSaleTransactionDto } from './dto/request.dto/req.list.dto';
import { UpdateMultiTransaction } from './dto/request.dto/update.multi.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { SalePdfTransaction } from './dto/request.dto/pdf.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Sales")
@UseGuards(RoleGuard)
@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post('/')
  async findAll(@Query() query: ReqSaleTransactionDto) {
    let response = await this.saleService.findAll(query);

    if (response.data.items) {
      response.data.items = response.data.items.map((data) => new ResListSaleDto(data));
    }

    return response;
  }

  @Post('/create')
  @AllowAccess(memberType.NORMAL, memberType.ADMIN)
  create(@Body() body: CreateSaleTransaction) {
    return this.saleService.createSale(body);
  }

  @Get('/zip-code')
  findAddressByZip(@Query() body: ZipCodeDto) {
    return this.saleService.findAddressByZip(body.zipCode);
  }

  @Get('/auto-id')
  getLastId() {
    return this.saleService.getNewSaleId();
  }

  @Delete('/delete/:saleId')
  @AllowAccess(memberType.NORMAL, memberType.ADMIN)
  delete(@Param('saleId') saleId: string) {
    return this.saleService.delete(saleId);
  }

  @Get('/:saleId')
  getSaleById(@Param('saleId') saleId: string) {
    return this.saleService.getSaleById(saleId);
  }

  @Post('/:saleId')
  @AllowAccess(memberType.NORMAL, memberType.ADMIN)
  update(@Body() body: CreateSaleTransaction, @Param('saleId') saleId: string) {
    return this.saleService.updateSale(body, saleId);
  }

  @Put('/multi')
  @AllowAccess(memberType.NORMAL, memberType.ADMIN)
  updateMulti(@Body() body: UpdateMultiTransaction) {
    return this.saleService.updateMultiSale(body);
  }

  @Put('/csv')
  exportCSV(@Body() body: UpdateMultiTransaction) {
    return this.saleService.csv(body);
  }

  @Put('/print')
  print(@Body() body: UpdateMultiTransaction) {
    return this.saleService.print(body);
  }

  @Post('print/sale-pdf')
  generatePDF(@Body() body: SalePdfTransaction) {
    return this.saleService.getSalePDF(body.saleId);
  }

  @Post('csv/yuupakku')
  generateCSV(@Body() body: SalePdfTransaction) {
    return this.saleService.getSaleCSVYuupakku(body.saleId);
  }

  @Put('/payment-statement-pdf')
  @AllowAccess(memberType.NORMAL, memberType.ADMIN)
  getPaymentStatementPDF(@Body() body: SalePdfTransaction) {
    return this.saleService.getPaymentStatementPDF(body.saleId);
  }

  @Put('/export/sagawa')
  exportSagawa(@Body() body: SalePdfTransaction) {
    return this.saleService.exportToCsv(body.saleId);
  }
}
