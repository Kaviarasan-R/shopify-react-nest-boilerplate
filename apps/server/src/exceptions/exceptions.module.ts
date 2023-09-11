import { Module } from '@nestjs/common';
import { AuthException } from '@/exceptions/auth-exception.service';

@Module({
  providers: [AuthException],
})
export class ExceptionsModule {}
