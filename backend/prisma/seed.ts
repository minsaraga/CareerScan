import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create sample questions
  const questions = [
    {
      text: "When working on a project, do you prefer to:",
      optionA: "Plan everything in detail before starting",
      optionB: "Jump in and figure it out as you go",
      weightA: 1,
      weightB: 2,
      order: 1
    },
    {
      text: "In a team meeting, you are more likely to:",
      optionA: "Listen carefully and contribute when asked",
      optionB: "Actively participate and share ideas frequently",
      weightA: 1,
      weightB: 2,
      order: 2
    },
    {
      text: "When learning something new, you prefer:",
      optionA: "Reading and studying theoretical concepts first",
      optionB: "Hands-on practice and experimentation",
      weightA: 1,
      weightB: 2,
      order: 3
    },
    {
      text: "Your ideal work environment is:",
      optionA: "Quiet and structured with minimal interruptions",
      optionB: "Dynamic and collaborative with lots of interaction",
      weightA: 1,
      weightB: 2,
      order: 4
    },
    {
      text: "When facing a problem, you typically:",
      optionA: "Analyze all possible solutions carefully",
      optionB: "Try the most promising solution quickly",
      weightA: 1,
      weightB: 2,
      order: 5
    }
  ];

  for (const q of questions) {
    await prisma.question.upsert({
      where: { order: q.order },
      update: {},
      create: q
    });
  }

  // Create sample institutions
  const institutions = [
    {
      name: 'Pune Institute of Computer Technology',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      website: 'https://pict.edu'
    },
    {
      name: 'Indian Institute of Technology Bombay',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      website: 'https://iitb.ac.in'
    },
    {
      name: 'National Institute of Design',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      website: 'https://nid.edu'
    }
  ];

  for (const inst of institutions) {
    const institution = await prisma.institution.upsert({
      where: { name: inst.name },
      update: {},
      create: inst
    });

    // Create sample courses for each institution
    const courses = [
      {
        institutionId: institution.id,
        name: 'B.Tech Computer Engineering',
        category: 'Engineering',
        level: 'UG',
        description: 'Comprehensive computer engineering program',
        tags: ['Programming', 'Software', 'Hardware'],
        personaFit: ['Energetic_Responder', 'Deliberate_Listener']
      },
      {
        institutionId: institution.id,
        name: 'Data Science Certificate',
        category: 'Data Science',
        level: 'Certificate',
        description: 'Professional data science certification',
        tags: ['Python', 'Analytics', 'Machine Learning'],
        personaFit: ['Deliberate_Listener']
      }
    ];

    for (const course of courses) {
      await prisma.course.upsert({
        where: { 
          institutionId_name: { 
            institutionId: course.institutionId, 
            name: course.name 
          } 
        },
        update: {},
        create: course
      });
    }
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });