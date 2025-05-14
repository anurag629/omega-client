import React, { useState, useEffect } from 'react';
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

interface RegisterFormData {
  email: string;
  invitation_token: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { email: queryEmail, token: queryToken } = router.query;
  const [registered, setRegistered] = useState(false);
  const { register: registerUser, isLoading, error } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();
  
  // Set email and token from query parameters if available
  useEffect(() => {
    if (queryEmail && typeof queryEmail === 'string') {
      setValue('email', queryEmail);
    }
    if (queryToken && typeof queryToken === 'string') {
      setValue('invitation_token', queryToken);
    }
  }, [queryEmail, queryToken, setValue]);
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      setRegistered(true);
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (err) {
      toast.error('Registration failed. Please try again.');
    }
  };
  
  return (
    <Layout>
      <Head>
        <title>Create Account | Omega</title>
        <meta name="description" content="Create your Codercops Omega account using your invitation code." />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-xl rounded-lg overflow-hidden"
          >
            {registered ? (
              <div className="p-8 text-center">
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
                <h2 className="text-2xl font-bold text-secondary-900 mb-4">Registration Successful!</h2>
                <p className="text-secondary-600 mb-8">
                  We've sent a verification link to your email address. Please check your inbox and verify your email to continue.
                </p>
                <Button
                  onClick={() => router.push('/login')}
                  variant="primary"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <div className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-secondary-900">Create Your Account</h1>
                  <p className="text-secondary-600 mt-2">
                    Join Omega with your invitation code
                  </p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      placeholder="John"
                      {...register('first_name', { required: 'First name is required' })}
                      error={errors.first_name?.message}
                    />
                    
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      {...register('last_name', { required: 'Last name is required' })}
                      error={errors.last_name?.message}
                    />
                  </div>
                  
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
                    disabled={!!queryEmail}
                  />
                  
                  <Input
                    label="Invitation Code"
                    placeholder="Your invitation code"
                    {...register('invitation_token', { required: 'Invitation code is required' })}
                    error={errors.invitation_token?.message}
                    disabled={!!queryToken}
                  />
                  
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a secure password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                    error={errors.password?.message}
                  />
                  
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    {...register('password2', {
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match',
                    })}
                    error={errors.password2?.message}
                  />
                  
                  {error && <p className="text-error text-center">{error}</p>}
                  
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    fullWidth
                  >
                    Create Account
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-secondary-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage; 