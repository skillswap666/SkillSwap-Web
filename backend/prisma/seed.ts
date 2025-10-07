import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Skill Swap database...\n');

  // -------------------------------
  // USERS
  // -------------------------------
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      bio: 'Passionate about teaching and learning.',
      credits: 150,
      skills: JSON.stringify(['React', 'TypeScript', 'UI/UX Design']),
      rating: 4.8,
      profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      bio: 'Data scientist and lifelong learner.',
      credits: 200,
      skills: JSON.stringify(['Python', 'Machine Learning', 'Data Visualization']),
      rating: 4.6,
      profilePicture: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
  });

  console.log('✅ Users created:', [alice.email, bob.email].join(', '));

  // -------------------------------
  // WORKSHOPS
  // -------------------------------
  const workshop1 = await prisma.workshop.upsert({
    where: { id: 'workshop-1' },
    update: {},
    create: {
      id: 'workshop-1',
      title: 'Intro to TypeScript',
      description: 'Learn the fundamentals of TypeScript for scalable JS apps.',
      category: 'Frontend',
      skillLevel: 'Beginner',
      date: new Date('2025-10-20T10:00:00Z'),
      location: 'Online',
      isOnline: true,
      creditCost: 50,
      creditReward: 10,
      maxParticipants: 20,
      hostId: alice.id,
    },
  });

  const workshop2 = await prisma.workshop.upsert({
    where: { id: 'workshop-2' },
    update: {},
    create: {
      id: 'workshop-2',
      title: 'Data Visualization with Python',
      description: 'Hands-on workshop exploring matplotlib and seaborn.',
      category: 'Data Science',
      skillLevel: 'Intermediate',
      date: new Date('2025-11-05T13:00:00Z'),
      location: 'Sydney Campus, Room B202',
      isOnline: false,
      creditCost: 80,
      creditReward: 20,
      maxParticipants: 15,
      hostId: bob.id,
    },
  });

  console.log('📚 Workshops created:', [workshop1.title, workshop2.title].join(', '));

  // -------------------------------
  // ATTENDEES (join table)
  // -------------------------------
  await prisma.workshopAttendee.upsert({
    where: { userId_workshopId: { userId: bob.id, workshopId: workshop1.id } },
    update: {},
    create: {
      userId: bob.id,
      workshopId: workshop1.id,
    },
  });

  await prisma.workshopAttendee.upsert({
    where: { userId_workshopId: { userId: alice.id, workshopId: workshop2.id } },
    update: {},
    create: {
      userId: alice.id,
      workshopId: workshop2.id,
    },
  });

  console.log('👥 Workshop attendees linked.');
  console.log('\n🎉 Seeding complete!');
}

// -------------------------------
// EXECUTION
// -------------------------------
main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });