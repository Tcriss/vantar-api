import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { validate } from 'uuid';

import { PrismaProvider } from '../../../../database/infrastructure/providers/prisma/prisma.provider';

@Injectable()
export class OwnerGuard implements CanActivate {

  constructor(private readonly prisma: PrismaProvider) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    return this.isOwner(req);
  }

  private async isOwner(req: Request): Promise<boolean> {
    const shopId = await this.getShopIdFromUrl(req);
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId as string },
      select: { user_id: true }
    });
    
    if (!shop) throw new HttpException('no provided shop found', HttpStatus.NOT_FOUND);

    const userId: string = req['user']['id'];

    if (userId !== shop.user_id) throw new HttpException('resource not found', HttpStatus.NOT_FOUND);

    return true;
  }

  private async getShopIdFromUrl(req: Request) {
    const shopId = req.query.shop;

    if (!shopId) throw new HttpException("no 'shop' param provided in url", HttpStatus.BAD_REQUEST);
    if (!validate(shopId)) throw new HttpException("'shop' value is not a valid uuid", HttpStatus.BAD_REQUEST);

    return shopId;
  }
}
