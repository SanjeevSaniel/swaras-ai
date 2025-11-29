'use client';

/**
 * UpgradeCheckoutDialog Component
 *
 * A modal dialog for handling plan upgrades with Razorpay payment integration.
 * This component displays plan details, order summary, and payment options.
 *
 * @component
 * @example
 * ```tsx
 * <UpgradeCheckoutDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   selectedPlan={planData}
 *   onSuccess={() => console.log('Payment successful')}
 * />
 * ```
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Shield, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

/**
 * Plan interface defining the structure of a subscription plan
 */
interface Plan {
  name: string;
  tier: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}

/**
 * Props for the UpgradeCheckoutDialog component
 */
interface UpgradeCheckoutDialogProps {
  /** Controls dialog visibility */
  open: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** The plan selected for upgrade */
  selectedPlan: Plan | null;
  /** Callback fired on successful payment */
  onSuccess?: () => void;
}

/**
 * UpgradeCheckoutDialog - Main checkout dialog component
 *
 * Handles the complete checkout flow:
 * 1. Display plan summary
 * 2. Show order details
 * 3. Accept terms and conditions
 * 4. Call update-tier API to upgrade user
 * 5. Handle success/failure with toast notifications
 */
export function UpgradeCheckoutDialog({
  open,
  onOpenChange,
  selectedPlan,
  onSuccess,
}: UpgradeCheckoutDialogProps) {
  // State for terms acceptance
  const [termsAccepted, setTermsAccepted] = useState(false);
  // State for processing payment
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handles the plan upgrade
   * Calls the update-tier API to upgrade the user's plan
   * TODO: Integrate with Razorpay for actual payment processing
   */
  const handleProceedToPayment = async () => {
    if (!selectedPlan || !termsAccepted) return;

    setIsProcessing(true);

    try {
      // Call the update-tier API to upgrade the user
      const response = await fetch('/api/user/update-tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName: selectedPlan.tier }),
      });

      if (!response.ok) {
        throw new Error('Failed to update plan');
      }

      const data = await response.json();

      // Show success toast
      toast.success(`Successfully upgraded to ${selectedPlan.name} plan!`, {
        duration: 4000,
        position: 'top-center',
      });

      // Call success callback and close dialog
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Plan upgrade error:', error);

      // Show error toast
      toast.error('Failed to update your plan. Please try again.', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) return null;

  // Calculate pricing details
  const priceValue = parseFloat(selectedPlan.price.replace(/[^0-9.]/g, ''));
  const gst = priceValue * 0.18; // 18% GST
  const total = priceValue + gst;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent
        className='sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-hidden'
        showCloseButton={false}>
        {/* Header */}
        <DialogHeader className='px-6 py-4 border-b border-gray-100'>
          <div className='flex items-center justify-between'>
            <DialogTitle className='text-xl font-semibold'>
              Complete Your Upgrade
            </DialogTitle>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className='flex-1 overflow-y-auto px-6 py-6 space-y-6'>
          {/* Plan Summary Card */}
          <div className='rounded-xl border-2 border-gray-900 bg-gradient-to-br from-gray-50 to-white p-6'>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <h3 className='text-2xl font-bold text-gray-900'>
                  {selectedPlan.name} Plan
                </h3>
                <p className='text-sm text-gray-600 mt-1'>
                  {selectedPlan.description}
                </p>
              </div>
              {selectedPlan.popular && (
                <Badge
                  className='bg-yellow-400 text-black hover:bg-yellow-500'
                  variant='secondary'>
                  Popular
                </Badge>
              )}
            </div>

            {/* Price Display */}
            <div className='mb-4'>
              <div className='flex items-baseline gap-2'>
                <span className='text-4xl font-bold text-gray-900'>
                  {selectedPlan.price}
                </span>
                <span className='text-gray-600'>{selectedPlan.period}</span>
              </div>
            </div>

            {/* Features List */}
            <div className='space-y-2'>
              <p className='text-sm font-medium text-gray-700 mb-3'>
                What&apos;s included:
              </p>
              {selectedPlan.features.map((feature, index) => (
                <div
                  key={index}
                  className='flex items-start gap-2'>
                  <Check className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
                  <span className='text-sm text-gray-700'>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className='rounded-xl border border-gray-200 p-5 bg-gray-50/50'>
            <h4 className='font-semibold text-gray-900 mb-4'>Order Summary</h4>
            <div className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Plan Price</span>
                <span className='font-medium text-gray-900'>
                  {selectedPlan.price}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>GST (18%)</span>
                <span className='font-medium text-gray-900'>
                  ₹{gst.toFixed(2)}
                </span>
              </div>
              <div className='border-t border-gray-200 pt-3 flex justify-between'>
                <span className='font-semibold text-gray-900'>Total</span>
                <span className='font-bold text-xl text-gray-900'>
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method - Placeholder */}
          <div className='rounded-xl border border-gray-200 p-5'>
            <div className='flex items-center gap-2 mb-4'>
              <CreditCard className='h-5 w-5 text-gray-700' />
              <h4 className='font-semibold text-gray-900'>Payment Method</h4>
            </div>
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <p className='text-sm text-blue-900'>
                <strong>Razorpay Integration</strong> - Secure payment gateway
                supporting UPI, Cards, Net Banking, and Wallets
              </p>
              <p className='text-xs text-blue-700 mt-2'>
                (Payment gateway will be activated after integration)
              </p>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className='flex items-start gap-3'>
            <input
              type='checkbox'
              id='terms'
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className='mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900'
              disabled={isProcessing}
            />
            <label
              htmlFor='terms'
              className='text-sm text-gray-600'>
              I agree to the{' '}
              <a
                href='#'
                className='text-gray-900 underline hover:no-underline'>
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='#'
                className='text-gray-900 underline hover:no-underline'>
                Privacy Policy
              </a>
              . I understand that my subscription will auto-renew monthly.
            </label>
          </div>

          {/* Security Badge */}
          <div className='flex items-center gap-2 text-xs text-gray-500'>
            <Shield className='h-4 w-4' />
            <span>Secured by 256-bit SSL encryption</span>
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className='border-t border-gray-100 px-6 py-4 bg-gray-50'>
          <div className='flex gap-3'>
            <Button
              variant='outline'
              size='default'
              className='flex-1'
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant='default'
              size='default'
              className='flex-1 bg-gray-900 text-white hover:bg-gray-800'
              onClick={handleProceedToPayment}
              disabled={!termsAccepted || isProcessing}>
              {isProcessing ? (
                <>
                  <motion.div
                    className='h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2'
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  Processing...
                </>
              ) : (
                <>Proceed to Payment</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
