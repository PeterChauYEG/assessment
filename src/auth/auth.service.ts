import { Injectable, Logger } from '@nestjs/common';
import * as stytch from 'stytch';
import { ConfigService } from '@nestjs/config';

import { RegisterRequestDto } from './dtos/register.request.dto';
import { LoginRequestDto } from './dtos/login.request.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  private authClient: stytch.Client;

  constructor(private configService: ConfigService) {
    this.authClient = new stytch.Client({
      project_id: this.configService.get<string>('STYTCH_PROJECT_ID'),
      secret: this.configService.get<string>('STYTCH_SECRET'),
      env:
        this.configService.get<string>('STYTCH_ENV') === 'test'
          ? stytch.envs.test
          : stytch.envs.live,
    });
  }

  async passwordRegister(data: RegisterRequestDto): Promise<string> {
    this.logger.debug('passwordSignIn');

    const res = await this.authClient.passwords.create({
      email: data.email,
      password: data.password,
    });

    if (res.user_id) {
      return res.user_id;
    }
  }

  async passwordSignIn(data: LoginRequestDto): Promise<string> {
    this.logger.debug('passwordSignIn');

    const res = await this.authClient.passwords.authenticate({
      email: data.email,
      password: data.password,
    });

    if (res.user_id) {
      return res.user_id;
    }
  }
}
