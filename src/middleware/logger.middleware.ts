import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, _res: Response, next: NextFunction): void {
    if (
      req?.method === 'POST' &&
      req?.originalUrl === '/graphql' &&
      req?.body?.operationName
    ) {
      this.logger.log(
        `${req.method} ${req.originalUrl} ${req.body.operationName}`,
      );
    } else {
      this.logger.log(`${req.method} ${req.originalUrl}`);
    }

    next();
  }
}
