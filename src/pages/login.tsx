import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import useAuthStore from '@/store/auth';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);
  
  // Show toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const onSubmit = async (data: LoginFormData) => {
    // Call login function from auth store
    // Success handling will be done by the isAuthenticated effect
    await login(data.email, data.password);
    
    // Only show success toast if authentication is successful
    if (useAuthStore.getState().isAuthenticated) {
      toast.success('Logged in successfully!');
    }
  };
  
  return (
    <Layout>
      <Head>
        <title>Sign In | Omega</title>
        <meta name="description" content="Sign in to your Codercops Omega account." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Welcome Back</h1>
              <p className="text-secondary-600 dark:text-gray-300 mt-2">
                Sign in to your Omega account
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.email?.message}
              />
              
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                })}
                error={errors.password?.message}
              />
              
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300">
                  <p>{error}</p>
                </div>
              )}
              
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
              >
                Sign In
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-600 dark:text-gray-300">
                Don't have an account?{' '}
                <Link href="/waitlist" className="font-medium text-primary-600 dark:text-blue-400">
                  Join our waiting list
                </Link>
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/verify-email')}
                >
                  Resend Verification Email
                </Button>
                <Button
                  variant="text"
                  onClick={() => router.push('/forgot-password')}
                >
                  Forgot Password?
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage; 