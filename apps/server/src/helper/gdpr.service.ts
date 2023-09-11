import { Injectable } from '@nestjs/common';

@Injectable()
export class Gdpr {
  async CustomerDataRequest(topic, shop, webhookRequestBody) {
    try {
      console.log(`Handle ${topic} for ${shop}`);
      console.log(webhookRequestBody);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  }

  async CustomerRedact(topic, shop, webhookRequestBody) {
    try {
      console.log(`Handle ${topic} for ${shop}`);
      console.log(webhookRequestBody);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  }

  async ShopRedact(topic, shop, webhookRequestBody) {
    try {
      console.log(`Handle ${topic} for ${shop}`);
      console.log(webhookRequestBody);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  }
}
