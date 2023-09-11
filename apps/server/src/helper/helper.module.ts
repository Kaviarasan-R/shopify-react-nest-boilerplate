import { Module } from '@nestjs/common';
import { AuthRedirect } from '@/helper/auth-redirect.service';
import { Gdpr } from '@/helper/gdpr.service';
import { SessionService } from '@/helper/session.service';

/* Modules */
import { UtilsModule } from '@/utils/utils.module';
import { ShopifyModule } from '@/utils/shopify/shopify.module';

@Module({
  imports: [UtilsModule, ShopifyModule],
  providers: [AuthRedirect, Gdpr, SessionService],
  exports: [AuthRedirect, Gdpr, SessionService],
})
export class HelperModule {}
