import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
@Module({
  imports: [ConfigModule],
})
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    return this.configService.get<string>('MESSAGE');
  }
}
