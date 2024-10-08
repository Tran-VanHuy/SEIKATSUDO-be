import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';

@Injectable()
export class AppService extends BaseService {
  getHello(): string {
    return 'App running!';
  }
}
