// src/lib/db/seed.ts
// Migration script to seed the database with personas from existing data

import { neon } from "@neondatabase/serverless";
import { systemPrompts } from "@/constants/llm-prompts";

const sql = neon(process.env.DATABASE_URL!);

// Persona data to migrate
const personasToSeed = [
  {
    persona_key: 'hitesh',
    name: 'Hitesh Choudhary',
    title: 'Coding Educator & YouTuber',
    avatar_url: '/avatars/hitesh.jpg',
    description: 'Learn coding with chai! 1.6M+ subscribers teaching JavaScript, React, and full-stack development.',
    system_prompt: systemPrompts.hitesh,
    specialty: 'Coding',
    greeting_message: 'Haanji! Welcome to Chai aur Code! Kya seekhna hai aaj?',
    sort_order: 1,
    metadata: {
      youtube: 'https://youtube.com/@chaiaurcode',
      subscribers: '1.6M+',
      expertise: ['JavaScript', 'React', 'Node.js', 'Python']
    }
  },
  {
    persona_key: 'piyush',
    name: 'Piyush Garg',
    title: 'Full-Stack Developer & Educator',
    avatar_url: '/avatars/piyush.jpg',
    description: 'Practical coding education focused on modern development and system design.',
    system_prompt: systemPrompts.piyush,
    specialty: 'Full-Stack Development',
    greeting_message: 'Hey! Ready to build something awesome? What are we working on today?',
    sort_order: 2,
    metadata: {
      youtube: 'https://youtube.com/@piyushgarg',
      subscribers: '275K+',
      expertise: ['System Design', 'Full-Stack', 'Microservices']
    }
  },
  // Add more personas as needed
];

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if tier plans exist
    const existingTiers = await sql`SELECT COUNT(*) as count FROM tier_plans`;
    if (existingTiers[0].count === 0) {
      console.log('📊 Seeding tier plans...');
      await sql`
        INSERT INTO tier_plans (name, display_name, daily_message_limit, monthly_price, features)
        VALUES
          ('FREE', 'Free Plan', 10, 0.00, '["10 messages per day", "Access to all personas", "Basic support"]'::jsonb),
          ('PRO', 'Pro Plan', 200, 9.99, '["200 messages per day", "Priority response time", "Advanced features", "Email support"]'::jsonb),
          ('UNLIMITED', 'Unlimited Plan', 999999, 29.99, '["Unlimited messages", "Fastest response time", "All features", "24/7 priority support", "Early access to new personas"]'::jsonb)
      `;
      console.log('✅ Tier plans seeded');
    }

    // Seed personas
    console.log('🤖 Seeding personas...');
    for (const persona of personasToSeed) {
      try {
        await sql`
          INSERT INTO personas (
            persona_key, name, title, avatar_url, description,
            system_prompt, specialty, greeting_message, sort_order, metadata
          )
          VALUES (
            ${persona.persona_key},
            ${persona.name},
            ${persona.title},
            ${persona.avatar_url},
            ${persona.description},
            ${persona.system_prompt},
            ${persona.specialty},
            ${persona.greeting_message},
            ${persona.sort_order},
            ${JSON.stringify(persona.metadata)}::jsonb
          )
          ON CONFLICT (persona_key) DO UPDATE SET
            name = EXCLUDED.name,
            title = EXCLUDED.title,
            avatar_url = EXCLUDED.avatar_url,
            description = EXCLUDED.description,
            system_prompt = EXCLUDED.system_prompt,
            specialty = EXCLUDED.specialty,
            greeting_message = EXCLUDED.greeting_message,
            sort_order = EXCLUDED.sort_order,
            metadata = EXCLUDED.metadata,
            updated_at = CURRENT_TIMESTAMP
        `;
        console.log(`✅ Seeded persona: ${persona.name}`);
      } catch (error) {
        console.error(`❌ Error seeding persona ${persona.name}:`, error);
      }
    }

    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
