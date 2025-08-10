import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { z } from 'zod';
import { CatalogService } from './catalog.service';

const createInstitutionSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional()
});

const createCourseSchema = z.object({
  institutionId: z.string(),
  name: z.string().min(2),
  category: z.string().min(2),
  level: z.string().min(2),
  description: z.string().optional(),
  tags: z.array(z.string()),
  personaFit: z.array(z.string())
});

@Controller('catalog')
export class CatalogController {
  constructor(private service: CatalogService) {}

  @Get('institutions')
  async getInstitutions(@Query('city') city?: string, @Query('state') state?: string) {
    return this.service.getInstitutions(city, state);
  }

  @Get('courses')
  async getCourses(
    @Query('personaKey') personaKey?: string,
    @Query('city') city?: string,
    @Query('category') category?: string
  ) {
    return this.service.getCourses(personaKey, city, category);
  }

  @Post('institutions')
  async createInstitution(@Body() body: unknown) {
    const dto = createInstitutionSchema.parse(body);
    return this.service.createInstitution(dto);
  }

  @Post('courses')
  async createCourse(@Body() body: unknown) {
    const dto = createCourseSchema.parse(body);
    return this.service.createCourse(dto);
  }
}