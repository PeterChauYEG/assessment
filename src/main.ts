import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  console.time('startup');

  const logger: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.setGlobalPrefix('api');

  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.use(compression());

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder().setVersion('0.1').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  console.info(`Listening on port ${port}`);
  console.timeEnd('startup');
}

bootstrap();
