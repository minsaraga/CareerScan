import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

type Choice = 'A'|'B';
type Answer = { questionId: string; choice: Choice };

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async scoreAndRecommend(userId: string, answers: Answer[]) {
    // Simple rule-based scoring: count A/B, map to persona
    let a = 0, b = 0;
    for (const ans of answers) {
      const q = await this.prisma.question.findUnique({ where: { id: ans.questionId }});
      if (!q) continue;
      if (ans.choice === 'A') a += q.weightA;
      else b += q.weightB;
    }
    const personaKey = b > a ? 'Energetic_Responder' : 'Deliberate_Listener';

    const submission = await this.prisma.submission.create({
      data: {
        userId,
        answers: answers as any,
        personaKey,
        scoreVector: { a, b } as any
      }
    });

    const courses = await this.prisma.course.findMany({
      where: { personaFit: { has: personaKey }},
      include: { institution: true },
      take: 20
    });

    return { personaKey, submissionId: submission.id, courses };
  }

  async getUserSubmissions(userId: string) {
    return this.prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
  }
}