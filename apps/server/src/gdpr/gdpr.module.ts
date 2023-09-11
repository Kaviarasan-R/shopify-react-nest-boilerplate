import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GdprController } from '@/gdpr/gdpr.controller';

/* Middlewares */
import { VerifyHmac } from '@/middleware/verify-hmac.middleware';

/* Modules */
import { HelperModule } from '@/helper/helper.module';
import { UtilsModule } from '@/utils/utils.module';
import { ShopifyModule } from '@/utils/shopify/shopify.module';

@Module({
  imports: [HelperModule, UtilsModule, ShopifyModule],
  controllers: [GdprController],
})
export class GdprModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyHmac).forRoutes(GdprController);
  }
}
