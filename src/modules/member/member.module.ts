import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MemberService],
  exports: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}
