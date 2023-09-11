import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppsController } from '@/apps/apps.controller';

/* Modules */
import { UtilsModule } from '@/utils/utils.module';
import { ShopifyModule } from '@/utils/shopify/shopify.module';

/* Middlewares */
import { VerifyRequest } from '@/middleware/verify-request.middleware';

@Module({
  imports: [UtilsModule, ShopifyModule],
  controllers: [AppsController],
})
export class AppsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyRequest).forRoutes(AppsController);
  }
}
