import * as process from 'process';

export default () => ({
  JWT_SECRET: process.env.JWT_SECRET || 'secretKey',
  NODE_ENV: process.env.NODE_ENV || 'local',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  POSTGRES_DB: process.env.POSTGRES_DB || 'postgres',
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',
  POSTGRES_PORT: process.env.POSTGRES_PORT || '54321',
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  TZ: process.env.TZ || 'Etc/UTC',
  WEB_BASE_URL: process.env.WEB_BASE_URL || 'http://localhost:3000',
  STYTCH_PROJECT_ID: process.env.STYTCH_PROJECT_ID || 'project_id',
  STYTCH_SECRET: process.env.STYCH_SECRET || 'secret',
  STYTCH_ENV: process.env.STYTCH_ENV || 'test',
});
