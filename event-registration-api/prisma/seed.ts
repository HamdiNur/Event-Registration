import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Conference', description: 'Large professional gatherings and summits' },
    { name: 'Workshop', description: 'Hands-on learning and skill-building sessions' },
    { name: 'Seminar', description: 'Educational presentations and discussions' },
    { name: 'Social', description: 'Networking and community social events' },
    { name: 'Sports', description: 'Athletic competitions and fitness events' },
    { name: 'Cultural', description: 'Arts, music, and cultural celebrations' },
    { name: 'Technology', description: 'Tech talks, hackathons, and demos' },
    { name: 'Health', description: 'Wellness, medical, and health awareness events' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categories seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });