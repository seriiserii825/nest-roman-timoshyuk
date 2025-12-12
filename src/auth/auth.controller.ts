import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import type { IJwtRequest } from './interfaces/IJwtRequest';
import { CustomApiUnauthorizedResponse } from 'src/common/decorators/api-responses.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: LoginDto,
    description: 'User credentials',
    examples: {
      user: {
        summary: 'Example user',
        value: {
          email: 'radu@mail.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          email: 'user@example.com',
        },
      },
    },
  })
  @Post('login')
  async login(@Request() req: IJwtRequest) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @CustomApiUnauthorizedResponse()
  @ApiResponse({
    status: 200,
    description: 'Returns user profile',
    schema: {
      example: {
        userId: 1,
        email: 'user@example.com',
      },
    },
  })
  @Get('profile')
  getProfile(@Request() req: IJwtRequest) {
    return req.user;
  }
}
