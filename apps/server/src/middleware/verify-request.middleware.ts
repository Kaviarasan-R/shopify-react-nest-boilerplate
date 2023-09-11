import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/* Services */
import { SessionService } from '@/helper/session.service';
import { ShopifyService } from '@/utils/shopify/shopify.service';

@Injectable()
export class VerifyRequest implements NestMiddleware {
  private TEST_QUERY = `
  {
    shop {
      name
    }
  }`;
  constructor(
    private shopifyService: ShopifyService,
    private sessionService: SessionService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const urlPattern = /^https:\/\/\S+/;
      let url = '';

      for (const item of req.rawHeaders) {
        if (urlPattern.test(item)) {
          url = item;
          break;
        }
      }

      if (url) {
        const parsedUrl = new URL(url);
        let shop = parsedUrl.searchParams.get('shop');
        const host = parsedUrl.searchParams.get('host');

        const shopify = this.shopifyService.shopifyApi;

        const sessionId = await shopify.session.getCurrentId({
          isOnline: true,
          rawRequest: req,
          rawResponse: res,
        });
        const session = await this.sessionService.loadSession(sessionId);
        if (new Date(session?.expires) > new Date()) {
          const client = new shopify.clients.Graphql({ session });
          await client.query({ data: this.TEST_QUERY });
          res.setHeader(
            'Content-Security-Policy',
            `frame-ancestors https://${session.shop} https://admin.shopify.com;`,
          );
          return next();
        }

        const authBearer = req.headers.authorization?.match(/Bearer (.*)/);
        if (authBearer) {
          if (!shop) {
            if (session) {
              shop = session.shop;
            } else if (shopify.config.isEmbeddedApp) {
              if (authBearer) {
                const payload = await shopify.session.decodeSessionToken(
                  authBearer[1],
                );
                shop = payload.dest.replace('https://', '');
              }
            }
          }

          res.status(403);
          res.header('X-Shopify-API-Request-Failure-Reauthorize', '1');
          res.header(
            'X-Shopify-API-Request-Failure-Reauthorize-Url',
            `/exitframe?shop=${shop}&host=${host}`,
          );
          res.end();
        } else {
          return res
            .status(400)
            .send({ message: 'No authentication bearer token found' });
        }
      }
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .send({ error: "Nah I ain't serving this request" });
    }
  }
}
