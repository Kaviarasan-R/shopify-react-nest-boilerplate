import { Injectable } from '@nestjs/common';
import { LATEST_API_VERSION } from '@shopify/shopify-api';

/* Services */
import { SessionService } from '@/helper/session.service';
import { ShopifyService } from '@/utils/shopify/shopify.service';

@Injectable()
export class ClientProvider {
  private currentApiVersion = LATEST_API_VERSION;
  private shopifyApi = null;

  constructor(
    private shopifyService: ShopifyService,
    private sessionService: SessionService,
  ) {
    this.shopifyApi = this.shopifyService.shopifyApi;
  }

  async fetchSession({ req, res, isOnline }): Promise<any> {
    const sessionId = await this.shopifyApi.session.getCurrentId({
      isOnline: isOnline,
      rawRequest: req,
      rawResponse: res,
    });
    const session = await this.sessionService.loadSession(sessionId);
    return session;
  }

  async graphqlClient({ req, res, isOnline }): Promise<any> {
    const session = await this.fetchSession({ req, res, isOnline });
    const client = new this.shopifyApi.clients.Graphql({ session });
    const { shop } = session;
    return { client, shop, session };
  }

  async restClient({ req, res, isOnline }): Promise<any> {
    const session = await this.fetchSession({ req, res, isOnline });
    const client = new this.shopifyApi.clients.Rest({
      session,
      apiVersion: this.currentApiVersion,
    });
    const { shop } = session;
    return { client, shop, session };
  }

  async fetchOfflineSession(shop: any): Promise<any> {
    const sessionID = this.shopifyApi.session.getOfflineId(shop);
    const session = await this.sessionService.loadSession(sessionID);
    return session;
  }

  public offline = {
    graphqlClient: async ({ shop }) => {
      const session = await this.fetchOfflineSession(shop);
      const client = new this.shopifyApi.clients.Graphql({ session });
      return { client, shop, session };
    },
    restClient: async ({ shop }) => {
      const session = await this.fetchOfflineSession(shop);
      const client = new this.shopifyApi.clients.Rest({
        session,
        apiVersion: this.currentApiVersion,
      });
      return { client, shop, session };
    },
  };
}
