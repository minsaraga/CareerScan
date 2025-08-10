import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async getInstitutions(city?: string, state?: string) {
    const where: any = { active: true };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    
    return this.prisma.institution.findMany({
      where,
      include: { _count: { select: { courses: true } } }
    });
  }

  async getCourses(personaKey?: string, city?: string, category?: string) {
    const where: any = {};
    if (personaKey) where.personaFit = { has: personaKey };
    if (category) where.category = { contains: category, mode: 'insensitive' };
    if (city) where.institution = { city: { contains: city, mode: 'insensitive' } };

    return this.prisma.course.findMany({
      where,
      include: { institution: true },
      take: 50
    });
  }

  async createInstitution(data: { name: string; city: string; state: string; country: string; website?: string; logoUrl?: string }) {
    return this.prisma.institution.create({ data });
  }

  async createCourse(data: { institutionId: string; name: string; category: string; level: string; description?: string; tags: string[]; personaFit: string[] }) {
    return this.prisma.course.create({ data });
  }
}