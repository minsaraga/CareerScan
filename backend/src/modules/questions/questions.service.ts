import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async getActiveQuestions() {
    return this.prisma.question.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { id: true, text: true, optionA: true, optionB: true, order: true }
    });
  }

  async createQuestion(data: { text: string; optionA: string; optionB: string; weightA?: number; weightB?: number; order: number }) {
    return this.prisma.question.create({ data });
  }

  async updateQuestion(id: string, data: Partial<{ text: string; optionA: string; optionB: string; weightA: number; weightB: number; active: boolean; order: number }>) {
    return this.prisma.question.update({ where: { id }, data });
  }
}