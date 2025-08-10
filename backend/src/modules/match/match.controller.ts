import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { z } from 'zod';
import { MatchService } from './match.service';

const submitSchema = z.object({
  userId: z.string(),
  answers: z.array(z.object({ questionId: z.string(), choice: z.enum(['A','B']) }))
});

@Controller('match')
export class MatchController {
  constructor(private service: MatchService) {}

  @Post('submit')
  async submit(@Body() body: unknown) {
    const dto = submitSchema.parse(body);
    return this.service.scoreAndRecommend(dto.userId, dto.answers);
  }

  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string) {
    return this.service.getUserSubmissions(userId);
  }
}