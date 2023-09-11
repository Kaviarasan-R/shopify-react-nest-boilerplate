import { Injectable } from '@nestjs/common';
import { Session } from '@shopify/shopify-api';

/* Services */
import { PrismaService } from '@/utils/prisma.service';
import { CryptionService } from '@/utils/cryption.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cryptionService: CryptionService,
  ) {}

  async storeSession(session: Session): Promise<boolean> {
    const encryptedContent = this.cryptionService.encrypt(
      JSON.stringify(session),
    );

    await this.prismaService.sessions.upsert({
      where: { id: session.id },
      update: {
        content: encryptedContent,
        shop: session.shop,
      },
      create: {
        id: session.id,
        content: encryptedContent,
        shop: session.shop,
      },
    });

    return true;
  }

  async loadSession(id: string): Promise<Session | undefined> {
    const sessionResult = await this.prismaService.sessions.findUnique({
      where: { id },
    });

    if (!sessionResult) {
      return undefined;
    }

    if (sessionResult.content.length > 0) {
      const decryptedContent = this.cryptionService.decrypt(
        sessionResult.content,
      );
      const sessionObj = JSON.parse(decryptedContent);
      return new Session(sessionObj);
    }

    return undefined;
  }

  async loadSessionByShop(id: string): Promise<Session | undefined> {
    const sessionResult = await this.prismaService.sessions.findMany({
      where: { shop: id },
    });

    if (!sessionResult) {
      return undefined;
    }

    const filteredSessions = sessionResult.filter(
      (session) => !session.id.includes('offline'),
    );

    if (filteredSessions.length > 0) {
      const decryptedContent = this.cryptionService.decrypt(
        filteredSessions[0].content,
      );
      const sessionObj = JSON.parse(decryptedContent);
      return new Session(sessionObj);
    }

    return undefined;
  }

  async deleteSession(id: string): Promise<boolean> {
    await this.prismaService.sessions.deleteMany({ where: { id } });
    return true;
  }
}
