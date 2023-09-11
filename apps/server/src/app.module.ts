import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

/* Modules */
import { AppsModule } from '@/apps/apps.module';
import { AuthModule } from '@/auth/auth.module';
import { ExceptionsModule } from '@/exceptions/exceptions.module';
import { GdprModule } from '@/gdpr/gdpr.module';
import { GraphqlModule } from '@/graphql/graphql.module';
import { HelperModule } from '@/helper/helper.module';
import { UtilsModule } from '@/utils/utils.module';
import { ShopifyModule } from '@/utils/shopify/shopify.module';
import { WebhooksModule } from '@/webhooks/webhooks.module';

/* Middlewares */
import { CSP } from '@/middleware/csp.middleware';
import { IsShopActive } from '@/middleware/active-shops.middleware';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client', 'dist'),
    }),
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '../', '.env'),
      isGlobal: true,
    }),

    AppsModule,
    AuthModule,
    ExceptionsModule,
    GdprModule,
    GraphqlModule,
    HelperModule,
    UtilsModule,
    ShopifyModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CSP)
      .exclude('auth', 'auth/(.*)', 'webhooks', 'webhooks/(.*)', 'graphql')
      .forRoutes('*');
    consumer
      .apply(IsShopActive)
      .exclude('auth', 'auth/(.*)', 'webhooks', 'webhooks/(.*)', 'graphql')
      .forRoutes('*');
  }
}
