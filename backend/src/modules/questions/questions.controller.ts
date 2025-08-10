import { Body, Controller, Get, Post, Put, Param } from '@nestjs/common';
import { z } from 'zod';
import { QuestionsService } from './questions.service';

const createQuestionSchema = z.object({
  text: z.string().min(10),
  optionA: z.string().min(2),
  optionB: z.string().min(2),
  weightA: z.number().optional(),
  weightB: z.number().optional(),
  order: z.number()
});

@Controller('questions')
export class QuestionsController {
  constructor(private service: QuestionsService) {}

  @Get()
  async getQuestions() {
    return this.service.getActiveQuestions();
  }

  @Post()
  async createQuestion(@Body() body: unknown) {
    const dto = createQuestionSchema.parse(body);
    return this.service.createQuestion(dto);
  }

  @Put(':id')
  async updateQuestion(@Param('id') id: string, @Body() body: unknown) {
    const dto = createQuestionSchema.partial().parse(body);
    return this.service.updateQuestion(id, dto);
  }
}