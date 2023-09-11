import { Module } from '@nestjs/common';

/* Services */
import { ShopifyService } from '@/utils/shopify/shopify.service';
import { PrismaService } from '@/utils/prisma.service';

@Module({
  providers: [ShopifyService, PrismaService],
  exports: [ShopifyService],
})
export class ShopifyModule {}
