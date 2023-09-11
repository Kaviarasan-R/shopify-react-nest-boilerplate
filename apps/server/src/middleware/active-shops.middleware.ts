import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { PrismaService } from '@/utils/prisma.service';

@Injectable()
export class IsShopActive implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const shop = req.query.shop;

    if (!shop) {
      next();
      return;
    }

    try {
      const shopAsString: string = shop as string;
      const isShopAvailable = await this.prisma.activeStores.findUnique({
        where: { shop: shopAsString },
      });

      if (isShopAvailable === null || !isShopAvailable.isActive) {
        if (isShopAvailable === null) {
          await this.prisma.activeStores.create({
            data: {
              shop: shopAsString,
              isActive: false,
            },
          });
        } else if (!isShopAvailable.isActive) {
          await this.prisma.activeStores.update({
            where: { shop: shopAsString },
            data: {
              isActive: false,
            },
          });
        }

        return res.status(400).json({ message: 'No active shop found' });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  }
}
