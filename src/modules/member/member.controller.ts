import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { ListMemberTransactionDto } from './dto/request.dto/list.dto';
import { CreateMemberTransactionDto } from './dto/request.dto/create.dto';
import { UpdateMemberTransactionDto } from './dto/request.dto/update.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AllowAccess } from 'src/decorators/allow-access';
import { memberType } from 'src/constants/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Members")
@UseGuards(RoleGuard)
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('/')
  findAll() {
    return this.memberService.findAll();
  }

  @Post('/search')
  search(@Query() query: ListMemberTransactionDto) {
    return this.memberService.findAllStaff(
      {
        page: query.currentPage,
        limit: query.rowsPerPage,
        route: '',
      },
      query,
    );
  }

  @Post('/create')
  @AllowAccess(memberType.ADMIN)
  create(@Body() body: CreateMemberTransactionDto) {
    return this.memberService.createStaff(body);
  }

  @Delete('/:id')
  @AllowAccess(memberType.ADMIN)
  delete(@Param('id') id: string) {
    return this.memberService.delete(id);
  }

  @Get('/:id/info')
  getById(@Param('id') id: string) {
    return this.memberService.getStaffById(id);
  }

  @Post('/:id')
  update(@Body() body: UpdateMemberTransactionDto, @Param('id') id: string) {
    return this.memberService.updateStaff(body, id);
  }

  @Get('/auto-id')
  createNewStaffId() {
    return this.memberService.getNewIdStaff();
  }
}
