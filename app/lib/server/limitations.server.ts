import type { Type } from 'app/moduls/limitation/constants';
import { prisma } from './db.server';
import config from 'app/config';

export interface LimitationInput {
  itemId: string;
  type: 'VARIANT' | 'SKU';
  name: string;
  min: number;
  max: number;
}

export class LimitationsService {
  static async getLimitations(shopId: string, options: {
    type?: 'VARIANT' | 'SKU';
    page?: number;
    pageSize?: number;
  } = {}) {
    const { type, page = config.pagination.page, pageSize = config.pagination.pageSize } = options;
    const skip = (page - 1) * pageSize;

    const where = {
      shopId,
      ...(type ? { type: type as Type } : {})
    };

    const [limitations, total] = await Promise.all([
      prisma.limitation.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.limitation.count({ where })
    ]);

    return {
      data: limitations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
        totalItems: total,
        pageSize
      }
    };
  }

  static async saveLimitations(shopId: string, limitations: LimitationInput[]) {
    await prisma.shop.upsert({
      where: { id: shopId },
      update: { updatedAt: new Date() },
      create: { id: shopId, domain: shopId }
    });

    const result = await prisma.$transaction(async (tx) => {
      const results = await Promise.all(
        limitations.map(limitation =>
          tx.limitation.upsert({
            where: {
              shopId_itemId_type: {
                shopId,
                itemId: limitation.itemId,
                type: limitation.type as Type
              }
            },
            update: {
              name: limitation.name,
              min: limitation.min,
              max: limitation.max,
              updatedAt: new Date()
            },
            create: {
              shopId,
              itemId: limitation.itemId,
              type: limitation.type as Type,
              name: limitation.name,
              min: limitation.min,
              max: limitation.max
            }
          })
        )
      );

      return results;
    });

    return result;
  }

  static async deleteLimitation(id: string) {
    const limitation = await prisma.limitation.findUnique({
      where: { id }
    });

    if (!limitation) {
      throw new Error('Limitation not found');
    }

    await prisma.limitation.delete({
      where: { id }
    });
  }

  static async getWarningMessages(shopId: string) {
    const message = await prisma.warningMessage.findUnique({
      where: { shopId }
    });

    return message || { minMessage: "", maxMessage: "" };
  }

  static async saveWarningMessages(shopId: string, minMessage: string, maxMessage: string) {
    await prisma.shop.upsert({
      where: { id: shopId },
      update: { updatedAt: new Date() },
      create: { id: shopId, domain: shopId }
    });

    return prisma.warningMessage.upsert({
      where: { shopId },
      update: { minMessage, maxMessage, updatedAt: new Date() },
      create: { shopId, minMessage, maxMessage }
    });
  }

  static async bulkDeleteLimitations(ids: string[]) {
    return prisma.limitation.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });
  }
}