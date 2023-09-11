import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphqlController } from '@/graphql/graphql.controller';

/* Modules */
import { UtilsModule } from '@/utils/utils.module';
import { ShopifyModule } from '@/utils/shopify/shopify.module';

/* Middlewares */
import { VerifyRequest } from '@/middleware/verify-request.middleware';

@Module({
  imports: [UtilsModule, ShopifyModule],
  controllers: [GraphqlController],
})
export class GraphqlModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyRequest).forRoutes(GraphqlController);
  }
}
