import { Controller, Post, Req, Res } from '@nestjs/common';

import { Gdpr } from '@/helper/gdpr.service';

@Controller('gdpr')
export class GdprController {
  constructor(private gdpr: Gdpr) {}

  @Post(':topic')
  async topic(@Req() req, @Res() res) {
    const { body } = req;
    const { topic } = req.params;
    const shop = req.body.shop_domain;
    console.warn(`--> GDPR request for ${shop} / ${topic} recieved.`);
    let response;
    switch (topic) {
      case 'customers_data_request':
        response = await this.gdpr.CustomerDataRequest(topic, shop, body);
        break;
      case 'customers_redact':
        response = await this.gdpr.CustomerRedact(topic, shop, body);
        break;
      case 'shop_redact':
        response = await this.gdpr.ShopRedact(topic, shop, body);
        break;
      default:
        console.error(
          "--> Congratulations on breaking the GDPR route! Here's the topic that broke it: ",
          topic,
        );
        response = 'broken';
        break;
    }
    if (response.success) {
      res.status(200).send();
    } else {
      res.status(403).send('An error occured');
    }
  }
}
