import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private configService : ConfigService){};
  @Get()
  getHello(): string {
    const message = this.configService.get('MESSAGE');
    return message;
  }

  @Get('service-url')
  getServiceUrl(): string{
    console.log('s');
    console.log(`${this.configService.get('SERVICE_URL')}`)
    console.log(`${process.cwd()}/envs/${process.env.NODE_ENV}.env`)
    return this.configService.get('SERVICE_URL');
  }

  @Get('server-url')
  getServerUrl(): string{
    return this.configService.get('SERVER_URL');
  }

  @Get('db-info')
  getTest(): string {
    console.log(this.configService.get('logLevel'));
    console.log(this.configService.get('apiVersion'));
    return this.configService.get('dbInfo');
  }

  @Get('redis-info')
  getRedisInfo(): string{
    return `${this.configService.get('redis.host')}:${this.configService.get('redis.port')}`;
  }
}

