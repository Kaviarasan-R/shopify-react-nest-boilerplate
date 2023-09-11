import { Injectable, UseFilters } from '@nestjs/common';

/* Services */
import { AuthException } from '@/exceptions/auth-exception.service';
import { SessionService } from '@/helper/session.service';
import { PrismaService } from '@/utils/prisma.service';
import { ShopifyService } from '@/utils/shopify/shopify.service';

@Injectable()
export class AuthService {
  constructor(
    private shopifyService: ShopifyService,
    private prisma: PrismaService,
    private session: SessionService,
  ) {}

  @UseFilters(AuthException)
  async storeOfflineToken(req: any, res: any) {
    const shopifyApiInstance = this.shopifyService.shopifyApi;

    const callbackResponse = await shopifyApiInstance.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;

    await this.session.storeSession(session);

    this.shopifyService.shopifyWebhooks;

    const webhookRegisterResponse = await shopifyApiInstance.webhooks.register({
      session,
    });

    console.dir(webhookRegisterResponse, { depth: null });

    return await shopifyApiInstance.auth.begin({
      shop: session.shop,
      callbackPath: `/auth/online`,
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });
  }

  @UseFilters(AuthException)
  async storeOnlineToken(req, res) {
    const shopifyApiInstance = this.shopifyService.shopifyApi;

    const callbackResponse = await shopifyApiInstance.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { session } = callbackResponse;

    await this.session.storeSession(session);

    const { shop } = session;

    await this.prisma.activeStores.upsert({
      where: { shop: shop },
      update: { isActive: true },
      create: {
        shop: shop,
        isActive: true,
      },
    });

    return shop;
  }
}
