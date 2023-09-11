import { Module } from '@nestjs/common';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';

/* Modules */
import { HelperModule } from '@/helper/helper.module';
import { UtilsModule } from '@/utils/utils.module';
import { ShopifyModule } from '@/utils/shopify/shopify.module';

@Module({
  imports: [HelperModule, UtilsModule, ShopifyModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
