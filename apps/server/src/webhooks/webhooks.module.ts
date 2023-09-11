import { MiddlewareConsumer, Module } from '@nestjs/common';

import { WebhooksController } from './webhooks.controller';

/* Modules */
import { ShopifyModule } from '@/utils/shopify/shopify.module';
import { UtilsModule } from '@/utils/utils.module';

/* Middlewares */
import { VerifyHmac } from '@/middleware/verify-hmac.middleware';

/* Services */
import { WebhooksService } from '@/webhooks/webhooks.service';

@Module({
  imports: [ShopifyModule, UtilsModule],
  providers: [WebhooksService],
  controllers: [WebhooksController],
})
export class WebhooksModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyHmac).forRoutes(WebhooksController);
  }
}
