import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/* ShoifyServices */
import { ShopifyService } from '@/utils/shopify/shopify.service';

@Injectable()
export class CSP implements NestMiddleware {
  constructor(private readonly shopifyService: ShopifyService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const shopifyApi = this.shopifyService.shopifyApi;
    const shop = req.query.shop;

    if (shopifyApi.config.isEmbeddedApp && shop) {
      res.setHeader(
        'Content-Security-Policy',
        `frame-ancestors https://${shop} https://admin.shopify.com;`,
      );
    } else {
      res.setHeader('Content-Security-Policy', "frame-ancestors 'none';");
    }
    next();
  }
}
