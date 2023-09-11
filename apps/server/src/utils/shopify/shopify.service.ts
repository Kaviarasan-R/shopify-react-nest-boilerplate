import '@shopify/shopify-api/adapters/node';
import { Injectable, Module } from '@nestjs/common';
import {
  shopifyApi,
  LogSeverity,
  LATEST_API_VERSION,
} from '@shopify/shopify-api';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DeliveryMethod } from '@shopify/shopify-api';

@Injectable()
@Module({
  imports: [ConfigModule],
})
export class ShopifyService {
  constructor(private configService: ConfigService) {}

  private readonly shopifyApiInstance = shopifyApi({
    apiKey: this.configService.get<string>('SHOPIFY_API_KEY'),
    apiSecretKey: this.configService.get<string>('SHOPIFY_API_SECRET'),
    scopes: this.configService.get<string>('SHOPIFY_API_SCOPES').split(','),
    hostName: this.configService
      .get<string>('SHOPIFY_APP_URL')
      .replace(/https:\/\//, ''),
    hostScheme: 'https',
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: true,
    logger: {
      level: LogSeverity.Debug,
    },
  });

  get shopifyApi() {
    return this.shopifyApiInstance;
  }

  private readonly shopifyWebhookRegister =
    this.shopifyApiInstance.webhooks.addHandlers({
      APP_UNINSTALLED: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: '/webhooks/app_uninstalled',
      },
      SHOP_UPDATE: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: '/webhooks/shop_update',
      },
    });

  get shopifyWebhooks() {
    return this.shopifyWebhookRegister;
  }
}
