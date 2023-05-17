import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<string> {
    this.logger.debug('create');

    const entity: User = await this.prisma.user.create({
      data,
    });

    return entity.id;
  }

  async findOneByExternalId(externalId: string): Promise<User> {
    this.logger.debug('findOneByExternalId');

    return await this.prisma.user.findUnique({
      where: { externalId },
    });
  }

  async findMany(): Promise<User[]> {
    this.logger.debug('findOneByUserId');

    return await this.prisma.user.findMany();
  }
}
