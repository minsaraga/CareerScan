import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { AuthService } from './auth.service';

const registerSchema = z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().min(2) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
const refreshSchema = z.object({ refreshToken: z.string().min(10) });

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  async register(@Body() body: unknown) {
    const dto = registerSchema.parse(body);
    return this.service.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  async login(@Body() body: unknown) {
    const dto = loginSchema.parse(body);
    return this.service.login(dto.email, dto.password);
  }

  @Post('refresh')
  async refresh(@Body() body: unknown) {
    const dto = refreshSchema.parse(body);
    return this.service.refresh(dto.refreshToken);
  }
}