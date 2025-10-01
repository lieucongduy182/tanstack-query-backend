import { NestFactory } from '@nestjs/core';
import { AppModule } from '../..//app.module';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { Todo } from '../../todos/entities/todo.entity';
import { DataSource, getConnection } from 'typeorm';

export function generatePostRecords(count = 100) {
  const titles = [
    'Next.js App Router Guide',
    'Building Scalable APIs',
    'Mastering TypeScript',
    'React Server Components Explained',
    'Deploying with Docker',
    'Introduction to Kubernetes',
    'GraphQL Best Practices',
    'REST API Design Patterns',
    'State Management with Redux',
    'Exploring Edge Functions',
    'Authentication in Modern Apps',
    'CI/CD Pipelines Simplified',
    'Serverless Architectures',
    'Debugging Node.js Apps',
    'Performance Optimization in React',
    'Microservices Architecture',
    'Event-Driven Systems',
    'Database Indexing Explained',
    'Caching Strategies for Web Apps',
    'Message Queues and Pub/Sub',
  ];

  const bodies = [
    'A comprehensive guide to understanding the topic in depth...',
    'Learn how to implement best practices and avoid pitfalls...',
    'Step-by-step tutorial with practical examples and code...',
    'Why this concept matters in modern development workflows...',
    'Comparing different approaches and their tradeoffs...',
    'Real-world case studies and lessons learned...',
    'Tips, tricks, and advanced techniques for professionals...',
  ];

  const records: Omit<Post, 'id' | 'user' | 'createdAt' | 'updatedAt'>[] = [];

  for (let i = 1; i <= count; i++) {
    const title = titles[Math.floor(Math.random() * titles.length)];
    const body = bodies[Math.floor(Math.random() * bodies.length)];
    const userId = Math.floor(Math.random() * 5) + 1; // 1–5
    const likes = Math.floor(Math.random() * 201); // 0–200

    records.push({
      title,
      body,
      userId,
      likes,
    });
  }

  return records;
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');

  const userRepository = dataSource.getRepository(User);
  const postRepository = dataSource.getRepository(Post);
  const todoRepository = dataSource.getRepository(Todo);

  await userRepository.clear();
  await postRepository.clear();
  await todoRepository.clear();

  await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');

  console.log('🗑️  Cleared existing data');

  // Seed Users
  const users = await userRepository.save([
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: '👩‍💻',
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: '👨‍💼',
    },
    {
      name: 'Carol White',
      email: 'carol@example.com',
      avatar: '👩‍🎨',
    },
    {
      name: 'David Brown',
      email: 'david@example.com',
      avatar: '👨‍💻',
    },
    {
      name: 'Eva Green',
      email: 'eva@example.com',
      avatar: '👩‍🔬',
    },
  ]);

  console.log('✅ Seeded users:', users.length);

  // Seed Posts
  const posts = await postRepository.save(generatePostRecords());
  console.log('✅ Seeded posts:', posts.length);

  // Seed Todos
  const todos = await todoRepository.save([
    {
      title: 'Learn TanStack Query',
      completed: true,
      userId: users[0].id,
    },
    {
      title: 'Build a Next.js app',
      completed: false,
      userId: users[0].id,
    },
    {
      title: 'Master TypeScript',
      completed: false,
      userId: users[0].id,
    },
    {
      title: 'Deploy to production',
      completed: false,
      userId: users[1].id,
    },
    {
      title: 'Write unit tests',
      completed: true,
      userId: users[1].id,
    },
  ]);

  console.log('✅ Seeded todos:', todos.length);
  console.log('🎉 Database seeded successfully!');

  await app.close();
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
