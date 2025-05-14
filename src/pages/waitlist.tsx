import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import useAuthStore from '@/store/auth';

interface WaitlistFormData {
  email: string;
  name: string;
  reason?: string;
}

const WaitlistPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { joinWaitlist, isLoading, error } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistFormData>();
  
  const onSubmit = async (data: WaitlistFormData) => {
    try {
      await joinWaitlist(data);
      setSubmitted(true);
      toast.success('You have been added to our waiting list!');
    } catch (err) {
      toast.error('An error occurred. Please try again. If the problem persists, contact support@codercops.com');
    }
  };
  
  return (
    <Layout>
      <Head>
        <title>Join the Waiting List | Omega</title>
        <meta name="description" content="Join the waiting list for Codercops Omega and be among the first to create stunning mathematical animations." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-xl rounded-lg overflow-hidden"
          >
            {submitted ? (
              <div className="p-8 md:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6"
                >
                  <svg className="w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h2 className="text-3xl font-bold text-secondary-900 mb-4">Thank You for Joining!</h2>
                <p className="text-lg text-secondary-600 mb-8">
                  We've added you to our waiting list. We'll notify you by email when we're ready to invite you to Omega.
                </p>
                <Button
                  onClick={() => window.location.href = 'https://github.com/codercops'}
                  variant="outline"
                >
                  Check out our GitHub
                </Button>
              </div>
            ) : (
              <>
                <div className="px-8 pt-8 pb-4 md:px-12 md:pt-12 md:pb-8">
                  <h1 className="text-3xl font-bold text-secondary-900 mb-2">Join the Waiting List</h1>
                  <p className="text-lg text-secondary-600 mb-6">
                    Be among the first to experience Omega, our AI-powered mathematical animation platform.
                  </p>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                      label="Your Name"
                      placeholder="John Doe"
                      {...register('name', { required: 'Name is required' })}
                      error={errors.name?.message}
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="your@email.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      error={errors.email?.message}
                    />
                    
                    <Textarea
                      label="Why are you interested in our platform? (Optional)"
                      placeholder="Tell us why you're interested in Omega and how you plan to use it..."
                      {...register('reason')}
                    />
                    
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
                        <p>{error}</p>
                        <p className="text-sm mt-1">If this problem persists, please contact support@codercops.com</p>
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isLoading}
                      fullWidth
                    >
                      Join the Waiting List
                    </Button>
                  </form>
                </div>
                
                <div className="bg-primary-50 px-8 py-6 md:px-12 md:py-8 border-t border-primary-100">
                  <h3 className="text-lg font-medium text-primary-900 mb-2">What happens next?</h3>
                  <ul className="list-disc list-inside text-primary-700 space-y-2">
                    <li>Your request will be reviewed by our team</li>
                    <li>We'll send an invitation to your email when a spot becomes available</li>
                    <li>You'll be able to create a full account and start using Omega</li>
                  </ul>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default WaitlistPage; 