import { Controller, Post, Req, Res } from '@nestjs/common';

/* Services */
import { ShopifyService } from '@/utils/shopify/shopify.service';
import { SessionService } from '@/helper/session.service';

@Controller('graphql')
export class GraphqlController {
  constructor(
    private shopifyService: ShopifyService,
    private sessionService: SessionService,
  ) {}
  @Post()
  async graphql(@Req() req, @Res() res) {
    try {
      const shopify = this.shopifyService.shopifyApi;
      const sessionId = await shopify.session.getCurrentId({
        isOnline: true,
        rawRequest: req,
        rawResponse: res,
      });
      const session = await this.sessionService.loadSession(sessionId);
      const response = await shopify.clients.graphqlProxy({
        session,
        rawBody: req.body,
      });
      console.log(`---> Successfully got response from GraphQL`);
      res.status(200).send(response.body);
    } catch (e) {
      console.error(`---> An error occured at GraphQL Proxy`, e);
      res.status(403).send(e);
    }
  }
}
