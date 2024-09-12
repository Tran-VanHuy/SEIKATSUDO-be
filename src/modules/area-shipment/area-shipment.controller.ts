import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AreaShipmentService } from './area-shipment.service';
import { ReqAreaShipmentTransactionDto } from './dto/req.create.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Area Shipment")
@UseGuards(RoleGuard)
@Controller('area-shipment')
export class AreaShipmentController {
  constructor(private readonly areaShipmentService: AreaShipmentService) {}

  @Get('/')
  findAll() {
    return this.areaShipmentService.findAll();
  }

  @Post('/:id')
  @AllowAccess(memberType.ADMIN)
  update(@Body() body: ReqAreaShipmentTransactionDto, @Param('id') id: string) {
    return this.areaShipmentService.updateSale(body, id);
  }
}
