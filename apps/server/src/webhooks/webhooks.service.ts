import { Injectable, Req, Res } from '@nestjs/common';

import { PrismaService } from '@/utils/prisma.service';
import { ShopifyService } from '@/utils/shopify/shopify.service';
import { SessionService } from '@/helper/session.service';

@Injectable()
export class WebhooksService {
  private TEST_QUERY = `
  {
    shop {
      name
    }
  }`;

  constructor(
    private prisma: PrismaService,
    private sessionService: SessionService,
    private shopifyService: ShopifyService,
  ) {}

  async appUninstall(@Req() req, @Res() res) {
    const shop = req.headers['x-shopify-shop-domain'];
    const fetchedStore = await this.findStore(shop);
    const tokenExpiration = await this.isTokenExpired(req, res);
    if (fetchedStore && fetchedStore?.isActive && tokenExpiration) {
      console.log('--> Session expired');
      await this.updateActiveStoreStatus(shop);
    } else {
      console.log("--> Session not expired, couldn't able to uninstall app.");
    }
  }

  async shopUpdate(@Req() req, @Res() res) {
    console.log(req.body);
  }

  async findStore(shop: string) {
    return await this.prisma.activeStores.findUnique({
      where: {
        shop: shop,
      },
    });
  }

  async updateActiveStoreStatus(shop: string) {
    await this.prisma.activeStores.update({
      where: { shop: shop },
      data: {
        isActive: false,
      },
    });
    await this.prisma.sessions.deleteMany({
      where: { shop: shop },
    });
  }

  async isTokenExpired(@Req() req, @Res() res) {
    try {
      const shopify = this.shopifyService.shopifyApi;
      const session = await this.sessionService.loadSessionByShop(
        req.headers['x-shopify-shop-domain'],
      );
      if (new Date(session?.expires) > new Date()) {
        const client = new shopify.clients.Graphql({ session });
        await client.query({ data: this.TEST_QUERY });
      }
      return false;
    } catch (err) {
      return true;
    }
  }
}
