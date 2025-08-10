import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  ok() { 
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'careerscan-backend',
      version: '1.0.0'
    }; 
  }

  @Get('ready')
  ready() {
    return { status: 'ready', timestamp: new Date().toISOString() };
  }
}