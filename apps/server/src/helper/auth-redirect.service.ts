import { Injectable, Req, Res } from '@nestjs/common';

/* Services */
import { ShopifyService } from '@/utils/shopify/shopify.service';

@Injectable()
export class AuthRedirect {
  constructor(private shopifyService: ShopifyService) {}

  async redirect(@Req() req, @Res() res) {
    const shopifyApi = this.shopifyService.shopifyApi;

    if (!req.query.shop) {
      return res.status(500).send('No shop provided');
    }

    if (req.query.embedded === '1') {
      const shop = shopifyApi.utils.sanitizeShop(req.query.shop);
      const queryParams = new URLSearchParams({
        ...req.query,
        shop,
        redirectUri: `https://${shopifyApi.config.hostName}/auth?shop=${shop}&host=${req.query.host}`,
      }).toString();
      return res.redirect(`/exitframe?${queryParams}`);
    }

    return shopifyApi.auth.begin({
      shop: req.query.shop,
      callbackPath: `/auth/offline`,
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });
  }
}
