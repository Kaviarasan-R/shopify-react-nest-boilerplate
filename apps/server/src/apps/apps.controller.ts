import {
  Controller,
  Module,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

/* Services */
import { ClientProvider } from '@/utils/client-provider.service';

@Controller('apps')
@Module({
  imports: [ConfigModule],
})
export class AppsController {
  constructor(
    private clientProvider: ClientProvider,
    private configService: ConfigService,
  ) {}

  @Get('/api')
  sendData() {
    return { text: 'This is coming from /apps/api route.' };
  }

  @Post('/api')
  postData(@Req() req) {
    return req.body;
  }

  @Get('/api/gql')
  async graphQl(@Req() req, @Res() res): Promise<any> {
    const { client } = await this.clientProvider.graphqlClient({
      req,
      res,
      isOnline: false,
    });

    const shop = await client.query({
      data: `{
        shop {
          name
        }
      }`,
    });

    res.status(200).send(shop);
  }

  @Get('/api/billing')
  async subscribe(@Req() req, @Res() res): Promise<any> {
    const { client, shop } = await this.clientProvider.graphqlClient({
      req,
      res,
      isOnline: true,
    });

    const returnUrl = `${this.configService.get<string>(
      'SHOPIFY_APP_URL',
    )}/auth?shop=${shop}`;
    const planName = '$10.25 plan';
    const planPrice = 10.25; //Always a decimal

    const response = await client.query({
      data: `mutation CreateSubscription {
        appSubscriptionCreate(
          name: "${planName}"
          returnUrl: "${returnUrl}"
          test: true
          lineItems: [
            {
              plan: {
                appRecurringPricingDetails: {
                  price: { amount: ${planPrice}, currencyCode: USD }
                }
              }
            }
          ]
        ) {
          userErrors {
            field
            message
          }
          confirmationUrl
          appSubscription {
            id
            status
          }
        }
      }
    `,
    });

    if (response.body.data.appSubscriptionCreate.userErrors.length > 0) {
      console.log(
        `--> Error subscribing ${shop} to plan:`,
        response.body.data.appSubscriptionCreate.userErrors,
      );
      res.status(400).send({ error: 'An error occured.' });
      return;
    }

    res.status(200).send({
      confirmationUrl: `${response.body.data.appSubscriptionCreate.confirmationUrl}`,
    });
  }
}
