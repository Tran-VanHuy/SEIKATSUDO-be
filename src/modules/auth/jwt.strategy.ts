import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import jwtConfig from 'src/config/jwt.config';
import { Repository } from 'typeorm';
import { Member } from 'src/entities/member.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(Member) private memberRepo: Repository<Member>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig().secret,
    });
  }

  async validate(payload: Member) {
    const member = await this.memberRepo.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!member || !payload.id) {
      throw new UnauthorizedException();
    }
    return member;
  }
}
