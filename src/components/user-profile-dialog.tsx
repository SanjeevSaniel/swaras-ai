'use client';

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sparkles, LogOut, CreditCard, Download, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { UpgradeCheckoutDialog } from './upgrade-checkout-dialog';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({
  open,
  onOpenChange,
}: UserProfileDialogProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState('profile');
  const [usageStats, setUsageStats] = useState({
    used: 0,
    limit: 10,
    percentage: 0,
    tier: 'Free',
  });
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] =
    useState<any>(null);

  // Fetch usage stats
  useEffect(() => {
    if (open) {
      const fetchUsage = async () => {
        try {
          const response = await fetch('/api/user/usage');
          if (response.ok) {
            const data = await response.json();
            setUsageStats(data);
          }
        } catch (error) {
          console.error('Failed to fetch usage stats:', error);
        } finally {
          setLoadingUsage(false);
        }
      };
      fetchUsage();
    }
  }, [open]);

  const paymentHistory = [
    // Mock payment history - will be populated from Razorpay
  ];

  const handleSignOut = () => {
    signOut();
    onOpenChange(false);
  };

  const allPlans = [
    {
      name: 'Free',
      tier: 'Free',
      price: '₹0',
      period: '/forever',
      description: 'Get started with AI mentorship',
      features: [
        '10 messages per day',
        'Access to all AI personas',
        'Basic support',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      tier: 'Pro',
      price: '₹499',
      period: '/month',
      description: 'For serious learners & professionals',
      features: [
        '100 messages per day',
        'Access to all AI personas',
        'Priority support',
      ],
      popular: true,
    },
    {
      name: 'Maxx',
      tier: 'Maxx',
      price: '₹2,499',
      period: '/month',
      description: 'For teams & power users',
      features: [
        '1000 messages per day',
        'Access to all AI personas',
        'Dedicated support',
      ],
      popular: false,
    },
  ];

  // Filter out the current plan - only show plans user can switch to
  const plans = allPlans.filter((plan) => plan.tier !== usageStats.tier);

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent
        className='sm:max-w-[800px] h-[600px] flex flex-col p-0 overflow-hidden'
        showCloseButton={false}>
        <DialogHeader className='px-6 py-2 border-b border-gray-100'>
          <div className='flex items-center justify-between'>
            <DialogTitle className='text-lg font-semibold'>
              Account Settings
            </DialogTitle>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                className='text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                onClick={() => onOpenChange(false)}>
                <span className='text-sm'>Close</span>
              </Button>
              <Button
                variant='secondary'
                size='sm'
                className='bg-red-400 text-white hover:bg-red-500 border-red-600 hover:border-red-700'
                onClick={handleSignOut}>
                <LogOut className='mr-1.5 h-4 w-4' />
                <span className='text-sm'>Sign Out</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className='flex-1 overflow-hidden'>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='h-full flex flex-col'>
            <div className='px-6'>
              <TabsList className='grid w-full grid-cols-2 max-w-[400px]'>
                <TabsTrigger
                  value='profile'
                  className='w-full'>
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value='billing'
                  className='w-full'>
                  Billing
                </TabsTrigger>
              </TabsList>
            </div>

            <div className='flex-1 overflow-y-auto px-6 py-6 pb-8 custom-scrollbar'>
              {/* Profile Tab */}
              <TabsContent
                value='profile'
                className='space-y-6 mt-0'>
                {/* User Info */}
                <div className='flex items-center gap-4'>
                  <Avatar className='h-20 w-20 border-2 border-gray-100'>
                    <AvatarImage
                      src={user.imageUrl}
                      alt={user.fullName || ''}
                      className='object-cover'
                    />
                    <AvatarFallback className='text-lg'>
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <h3 className='font-bold text-2xl text-gray-900'>
                      {user.fullName}
                    </h3>
                    <p className='text-gray-500'>
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                    <div className='mt-2 flex items-center gap-2'>
                      <Badge
                        className='px-2 py-0.5'
                        variant={
                          usageStats.tier === 'Premium'
                            ? 'default'
                            : 'secondary'
                        }>
                        {usageStats.tier} Plan
                      </Badge>
                      <span className='text-xs text-gray-400'>
                        Member since{' '}
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : 'recently'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className='rounded-lg border border-border bg-card p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium text-card-foreground'>
                      Daily Messages
                    </span>
                    <span className='text-sm font-semibold text-card-foreground'>
                      {loadingUsage
                        ? '...'
                        : `${usageStats.used} / ${usageStats.limit}`}
                    </span>
                  </div>
                  <div className='w-full bg-secondary rounded-full h-2 overflow-hidden'>
                    <motion.div
                      className={`h-full rounded-full ${
                        usageStats.percentage > 90
                          ? 'bg-destructive'
                          : usageStats.percentage > 75
                          ? 'bg-orange-500'
                          : 'bg-primary'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${usageStats.percentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className='text-xs text-muted-foreground mt-2'>
                    Resets daily at midnight
                  </p>
                </div>

                {/* Plan Change Section */}
                {plans.length > 0 && (
                  <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                      <Sparkles className='h-5 w-5 text-yellow-500' />
                      <h4 className='font-semibold text-lg'>
                        Change Your Plan
                      </h4>
                    </div>

                    <div className='grid md:grid-cols-2 gap-6'>
                      {plans.map((plan) => (
                        <div
                          key={plan.name}
                          className={`relative rounded-xl border p-5 transition-all duration-200 hover:shadow-md ${
                            plan.popular
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}>
                          {plan.popular && (
                            <span className='absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide'>
                              Most Popular
                            </span>
                          )}
                          <div className='flex justify-between items-start mb-2'>
                            <div>
                              <h5
                                className={`font-bold text-lg ${
                                  plan.popular ? 'text-white' : 'text-gray-900'
                                }`}>
                                {plan.name}
                              </h5>
                              <p
                                className={`text-xs ${
                                  plan.popular
                                    ? 'text-gray-300'
                                    : 'text-gray-500'
                                }`}>
                                {plan.description}
                              </p>
                            </div>
                            <div className='text-right'>
                              <span
                                className={`font-bold text-xl ${
                                  plan.popular ? 'text-white' : 'text-gray-900'
                                }`}>
                                {plan.price}
                              </span>
                              <span
                                className={`text-xs ${
                                  plan.popular
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }`}>
                                {plan.period}
                              </span>
                            </div>
                          </div>

                          <ul className='space-y-2 my-4'>
                            {plan.features.map((feature, i) => (
                              <li
                                key={i}
                                className='flex items-start gap-2 text-xs'>
                                <Check
                                  className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${
                                    plan.popular
                                      ? 'text-green-400'
                                      : 'text-green-600'
                                  }`}
                                />
                                <span
                                  className={
                                    plan.popular
                                      ? 'text-gray-300'
                                      : 'text-gray-600'
                                  }>
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <Button
                            variant='default'
                            className={`w-full ${
                              plan.popular
                                ? 'bg-white text-black hover:bg-gray-100'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
                            }`}
                            size='sm'
                            onClick={() => {
                              setSelectedPlanForCheckout(plan);
                              setCheckoutDialogOpen(true);
                            }}>
                            {plan.name === 'Free'
                              ? 'Downgrade to Free'
                              : `Upgrade to ${plan.name}`}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent
                value='billing'
                className='space-y-6 mt-0'>
                {usageStats.tier !== 'Premium' ? (
                  <div className='flex flex-col items-center justify-center h-[400px] text-center space-y-4'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
                      <CreditCard className='h-8 w-8 text-gray-400' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-lg text-gray-900'>
                        No Billing History
                      </h3>
                      <p className='text-sm text-gray-500 max-w-[250px] mx-auto mt-1'>
                        You are currently on the Free plan. Upgrade to Premium
                        to unlock billing history and invoices.
                      </p>
                    </div>
                    <Button
                      variant='default'
                      size='default'
                      className='w-full sm:w-auto'
                      onClick={() => setActiveTab('profile')}>
                      View Plans
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Payment History */}
                    <div className='space-y-4'>
                      <h4 className='font-semibold text-lg'>Payment History</h4>
                      {paymentHistory.length === 0 ? (
                        <div className='text-center py-12 border-2 border-dashed border-gray-200 rounded-xl'>
                          <p className='text-sm text-gray-500'>
                            No payment history available yet.
                          </p>
                        </div>
                      ) : (
                        <div className='space-y-2'>
                          {paymentHistory.map((payment: any) => (
                            <div
                              key={payment.id}
                              className='flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-shadow'>
                              <div>
                                <p className='font-bold text-gray-900'>
                                  {payment.amount}
                                </p>
                                <p className='text-xs text-gray-500'>
                                  {payment.date}
                                </p>
                              </div>
                              <div className='flex items-center gap-3'>
                                <Badge
                                  variant='secondary'
                                  className='bg-green-100 text-green-700 hover:bg-green-200 border-green-200'>
                                  {payment.status}
                                </Badge>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-8 w-8 text-gray-400 hover:text-gray-900'>
                                  <Download className='h-4 w-4' />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Next Billing */}
                    <div className='rounded-xl border border-gray-200 p-5 bg-gray-50/50'>
                      <div className='flex justify-between items-center'>
                        <div>
                          <p className='text-sm font-medium text-gray-600'>
                            Next Billing Date
                          </p>
                          <p className='text-lg font-bold text-gray-900'>
                            Feb 15, 2025
                          </p>
                        </div>
                        <Button
                          variant='outline'
                          size='sm'
                          className='h-9'>
                          Manage Subscription
                        </Button>
                      </div>
                    </div>

                    {/* Cancel Subscription */}
                    <div className='pt-4'>
                      <Button
                        variant='ghost'
                        size='default'
                        className='w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-sm'>
                        Cancel Subscription
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>

      {/* Upgrade Checkout Dialog */}
      <UpgradeCheckoutDialog
        open={checkoutDialogOpen}
        onOpenChange={setCheckoutDialogOpen}
        selectedPlan={selectedPlanForCheckout}
        onSuccess={() => {
          // Refresh usage stats after successful payment
          const fetchUsage = async () => {
            try {
              const response = await fetch('/api/user/usage');
              if (response.ok) {
                const data = await response.json();
                setUsageStats(data);
              }
            } catch (error) {
              console.error('Failed to fetch usage stats:', error);
            }
          };
          fetchUsage();
        }}
      />
    </Dialog>
  );
}
