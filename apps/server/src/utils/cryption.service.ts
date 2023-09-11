import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Cryptr from 'cryptr';

@Injectable()
@Module({
  imports: [ConfigModule],
})
export class CryptionService {
  private cryptr: Cryptr;

  constructor(private configService: ConfigService) {
    this.cryptr = new Cryptr(
      this.configService.get<string>('ENCRYPTION_STRING'),
    );
  }

  encrypt(data: string): string {
    return this.cryptr.encrypt(data);
  }

  decrypt(encryptedData: string): string {
    return this.cryptr.decrypt(encryptedData);
  }
}
