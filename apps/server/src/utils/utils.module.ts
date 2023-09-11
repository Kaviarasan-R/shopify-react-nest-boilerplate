import { Module } from '@nestjs/common';

/* Modules */
import { ShopifyModule } from '@/utils/shopify/shopify.module';

/* Services */
import { ClientProvider } from '@/utils/client-provider.service';
import { PrismaService } from '@/utils/prisma.service';
import { CryptionService } from '@/utils/cryption.service';
import { SessionService } from '@/helper/session.service';

@Module({
  imports: [ShopifyModule],
  providers: [ClientProvider, SessionService, PrismaService, CryptionService],
  exports: [ClientProvider, SessionService, PrismaService, CryptionService],
})
export class UtilsModule {}
