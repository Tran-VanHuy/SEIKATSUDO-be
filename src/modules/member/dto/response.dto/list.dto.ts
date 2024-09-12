import { Type } from 'class-transformer';
import { Member } from 'src/entities/member.entity';

export class MemberDto {
  @Type(() => Number)
  id: number;

  @Type(() => String)
  name: string;

  @Type(() => String)
  kana: string;

  @Type(() => String)
  staffCode: string;

  @Type(() => String)
  note: string;

  @Type(() => Date)
  startDate: Date;

  @Type(() => Date)
  endDate: Date;

  @Type(() => Number)
  disabled: number;

  @Type(() => Number)
  authority: number;

  constructor(member: Member) {
    this.id = member.id;
    this.name = member.name;
    this.kana = member.kana;
    this.staffCode = member.staffcode;
    this.note = member.note;
    this.startDate = member.startdate;
    this.endDate = member.enddate;
    this.disabled = member.disabled;
    this.authority = member.authority;
  }
}
