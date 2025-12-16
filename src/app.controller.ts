import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class UserController {
  @Get()
  health() {
    return { status: 'ok' };
  }
}
