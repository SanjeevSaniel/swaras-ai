'use client';

import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const pricingPlans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Get started with AI mentorship',
    features: [
      '10 messages per day',
      'Access to all AI personas',
      'Basic support',
      // 'GPT-4o powered responses',
    ],
    cta: 'Get started',
    href: '/signup',
    popular: false,
    gradient: 'from-gray-50 to-white',
    borderColor: 'border-gray-200',
    ctaVariant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '₹499',
    period: 'per month',
    description: 'For serious learners & professionals',
    features: [
      '100 messages per day',
      'Access to all AI personas',
      'Priority support',
      // 'GPT-4o powered responses',
      // 'Faster response time',
    ],
    cta: 'Upgrade to Pro',
    href: '/signup?plan=pro',
    popular: true,
    gradient: 'from-[#FA8072]/5 to-white',
    borderColor: 'border-[#FA8072]/30',
    ctaVariant: 'default' as const,
  },
  {
    name: 'Maxx',
    price: '₹2,499',
    period: 'per month',
    description: 'For teams & power users',
    features: [
      '1000 messages per day',
      'Access to all AI personas',
      'Dedicated support',
      // 'GPT-4o powered responses',
      // 'Priority processing',
      // 'API access (coming soon)',
    ],
    cta: 'Go Maxx',
    href: '/signup?plan=maxx',
    popular: false,
    gradient: 'from-gray-50 to-white',
    borderColor: 'border-gray-200',
    ctaVariant: 'outline' as const,
  },
];

export default function PricingSection() {
  return (
    <div className='relative bg-white py-24 overflow-hidden'>
      {/* Subtle background decoration */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-1/4 left-0 w-96 h-96 bg-[#FA8072]/5 rounded-full blur-3xl' />
        <div className='absolute bottom-1/4 right-0 w-96 h-96 bg-gray-100 rounded-full blur-3xl' />
      </div>

      <div className='container mx-auto px-6 relative'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-light text-gray-900 mb-4'>
            Simple, transparent pricing
          </h2>
          <p className='text-lg text-gray-600 font-light max-w-2xl mx-auto'>
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='relative'>
              {/* Popular badge */}
              {plan.popular && (
                <div className='absolute -top-4 left-1/2 -translate-x-1/2 z-10'>
                  <div className='px-4 py-1 bg-gradient-to-r from-[#FA8072] to-[#FF8E8E] text-white text-xs font-medium rounded-full shadow-lg'>
                    Most popular
                  </div>
                </div>
              )}

              {/* Card */}
              <motion.div
                whileHover={{
                  y: plan.popular ? -12 : -8,
                  scale: plan.popular ? 1.03 : 1.02,
                }}
                transition={{ duration: 0.3 }}
                className={`
                  relative p-8 rounded-2xl border-2 bg-gradient-to-br ${
                    plan.gradient
                  } ${plan.borderColor}
                  ${
                    plan.popular ? 'shadow-xl shadow-[#FA8072]/10' : 'shadow-sm'
                  }
                  hover:shadow-xl transition-all duration-300
                `}>
                {/* Plan name */}
                <h3 className='text-2xl font-medium text-gray-900 mb-2'>
                  {plan.name}
                </h3>

                {/* Price */}
                <div className='flex items-baseline gap-1 mb-1'>
                  <span className='text-5xl font-light text-gray-900'>
                    {plan.price}
                  </span>
                  <span className='text-sm text-gray-500 font-light'>
                    /{plan.period}
                  </span>
                </div>

                {/* Description */}
                <p className='text-sm text-gray-600 font-light mb-6 h-10'>
                  {plan.description}
                </p>

                {/* CTA Button */}
                <Link
                  href={plan.href}
                  className='block mb-6'>
                  <Button
                    variant={plan.popular ? 'default' : 'secondary'}
                    size='lg'
                    className={`
                      w-full rounded-full py-6 text-base font-medium transition-all duration-300
                      ${
                        plan.popular
                          ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-0'
                      }
                    `}>
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features */}
                <div className='space-y-3 pt-6 border-t border-gray-100'>
                  {plan.features.map((feature, i) => (
                    <div
                      key={i}
                      className='flex items-start gap-3'>
                      <Check
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          plan.popular ? 'text-[#FA8072]' : 'text-gray-400'
                        }`}
                      />
                      <span className='text-sm text-gray-700 font-light'>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='text-center mt-12'>
          <p className='text-sm text-gray-500 font-light'>
            All plans include access to all AI personas.{' '}
            <Link
              href='/contact'
              className='text-[#FA8072] hover:text-[#FA8072]/80 transition-colors underline'>
              Contact us
            </Link>{' '}
            for enterprise solutions.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
