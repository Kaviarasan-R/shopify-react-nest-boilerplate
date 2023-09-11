import { NestFactory } from '@nestjs/core';
import bodyParser from 'body-parser';

import CustomRequest from '@/types';

import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(
    bodyParser.json({
      limit: '5mb',
      verify: function (req: CustomRequest, res, buf) {
        req.originalBody = buf;
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
