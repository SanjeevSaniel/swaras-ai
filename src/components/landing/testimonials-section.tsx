'use client';

import { CardStack } from '@/components/ui/card-stack';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, User } from 'lucide-react';
import Image from 'next/image';

// Sample data for testimonials/chat snippets
const TESTIMONIALS = [
  {
    id: 1,
    personaId: 'hitesh',
    name: 'Hitesh Choudhary',
    role: 'Chai aur Code',
    avatar: 'https://avatars.githubusercontent.com/u/11613311?v=4',
    userQuery:
      'Sir, confused between React and Next.js for my first project. What should I pick?',
    aiResponse:
      'Haanji! Great question. Agar first project hai aur React ke basics clear hain, toh seedha Next.js utha lo. It gives you a complete framework structure. React is a library, Next.js is the framework. Production ready apps ke liye Next.js best hai. Chai piyo aur code karo! ☕',
    gradient: 'from-orange-100 to-amber-100',
    accent: 'text-orange-600',
  },
  {
    id: 2,
    personaId: 'piyush',
    name: 'Piyush Garg',
    role: 'Full Stack Developer',
    avatar:
      'https://www.piyushgarg.dev/_next/image?url=%2Fimages%2Favatar.png&w=1080&q=75',
    userQuery: 'How do I scale my Node.js app to handle 10k concurrent users?',
    aiResponse:
      "Stop right there! 🛑 Before you think about 10k users, is your code optimized? Use clustering to utilize all CPU cores. Then look into a load balancer like Nginx and Redis for caching. Don't over-engineer it early, but keep the architecture stateless. Let's ship it! 🚀",
    gradient: 'from-blue-100 to-cyan-100',
    accent: 'text-blue-600',
  },
  {
    id: 3,
    personaId: 'saptarshiux',
    name: 'Saptarshi Prakash',
    role: 'UX Designer',
    avatar:
      'https://pbs.twimg.com/profile_images/1257372007781425152/tmcdvef7_400x400.jpg',
    userQuery: 'My portfolio looks boring. How can I make it stand out?',
    aiResponse:
      "Let's think like a user. 🎨 Your portfolio isn't just a gallery; it's a story of your process. Don't just show the final UI. Show the messy sketches, the failed iterations, and the 'why' behind your decisions. That's what hiring managers care about. Make it human.",
    gradient: 'from-purple-100 to-indigo-100',
    accent: 'text-purple-600',
  },
];

const TestimonialCardContent = ({
  data,
}: {
  data: (typeof TESTIMONIALS)[0];
}) => {
  return (
    <div className='flex flex-col h-full gap-4'>
      {/* Persona Header */}
      <div className='flex items-center gap-3'>
        <div className='relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm'>
          <Image
            src={data.avatar}
            alt={data.name}
            fill
            className='object-cover'
          />
        </div>
        <div>
          <h3 className='font-semibold text-gray-900 text-sm'>{data.name}</h3>
          <p className='text-xs text-gray-500'>{data.role}</p>
        </div>
      </div>

      {/* Chat Conversation */}
      <div className='flex flex-col gap-3 flex-1 overflow-hidden'>
        {/* User Message */}
        <div className='flex gap-2 justify-end'>
          <div className='bg-gray-100 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%] text-xs text-gray-700'>
            <p>{data.userQuery}</p>
          </div>
          <div className='w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0'>
            <User className='w-3 h-3 text-gray-500' />
          </div>
        </div>

        {/* AI Response */}
        <div className='flex gap-2'>
          <div
            className={`w-6 h-6 rounded-full bg-gradient-to-br ${data.gradient} flex items-center justify-center flex-shrink-0`}>
            <Sparkles className={`w-3 h-3 ${data.accent}`} />
          </div>
          <div
            className={`bg-gradient-to-br ${data.gradient} bg-opacity-30 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[90%] text-xs text-gray-800 shadow-sm`}>
            <p className='leading-relaxed'>{data.aiResponse}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TestimonialsSection = () => {
  const cards = TESTIMONIALS.map((testimonial) => ({
    id: testimonial.id,
    content: <TestimonialCardContent data={testimonial} />,
  }));

  return (
    <section className='py-12 bg-transparent relative overflow-hidden'>
      <div className='container mx-auto px-6 relative z-10'>
        <div className='flex flex-col lg:flex-row items-center justify-center gap-12'>
          {/* Left Side: Text */}
          <div className='text-center lg:text-left max-w-lg'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium mb-4'>
              <MessageCircle className='w-3 h-3' />
              <span>Real Conversations</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='text-3xl md:text-4xl font-light text-gray-900 mb-4'>
              Experience the difference
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='text-base text-gray-600 font-light leading-relaxed'>
              See how our AI mentors provide personalized, expert guidance in
              every interaction. Click on the cards to see more examples.
            </motion.p>
          </div>

          {/* Right Side: Card Stack */}
          <div className='flex items-center justify-center w-full max-w-md h-80'>
            <CardStack items={cards} />
          </div>
        </div>
      </div>
    </section>
  );
};
