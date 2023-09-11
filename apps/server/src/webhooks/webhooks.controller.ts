import { Controller, Param, Post, Req, Res } from '@nestjs/common';

import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('/app_uninstalled')
  async AppUninstallHandler(@Req() req, @Res() res) {
    return this.webhooksService.appUninstall(req, res);
  }

  @Post('/shop_update')
  async ShopUpdateHandler(@Req() req, @Res() res) {
    return this.webhooksService.shopUpdate(req, res);
  }
}
