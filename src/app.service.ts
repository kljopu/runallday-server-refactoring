import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public serverHealthCheck(): string {
    return 'server alive!';
  }
}
