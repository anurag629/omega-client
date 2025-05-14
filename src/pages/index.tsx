import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import useAuthStore from '@/store/auth';
import useThemeStore from '@/store/theme';

const IndexPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const { darkMode } = useThemeStore();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  return (
    <Layout>
      <Head>
        <title>Omega | AI-Powered Mathematical Animations</title>
        <meta name="description" content="Create stunning mathematical animations with AI using the Manim engine." />
      </Head>
      
      {/* Hero section */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen flex flex-col pt-16">
        {/* Hero content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Hero text */}
              <motion.div variants={itemVariants} className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-secondary-900 dark:text-white mb-6">
                  <span className="block">AI-Powered</span>
                  <span className="block text-primary-600 dark:text-blue-400">Mathematical Animations</span>
                </h1>
                <p className="text-xl text-secondary-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                  Generate stunning animations with Manim using natural language. Powered by Google Gemini and Azure OpenAI.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href="/waitlist">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Join the Waiting List
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              {/* Hero image */}
              <motion.div variants={itemVariants} className="order-first lg:order-last">
                <div className="relative mx-auto max-w-md overflow-hidden rounded-xl shadow-xl">
                  <motion.img
                    src="/images/hero-animation.png" 
                    alt="Mathematical animation example"
                    className="w-full h-auto"
                    initial={{ scale: 1.1, rotate: 2 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Features section */}
          <div className="bg-white dark:bg-gray-800 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
                  How It Works
                </h2>
                <p className="text-xl text-secondary-600 dark:text-gray-300 max-w-2xl mx-auto">
                  From idea to animation in minutes, not hours.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-primary-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-primary-600 dark:text-blue-300 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

const features = [
  {
    title: "Describe Your Animation",
    description: "Using plain language, describe the mathematical animation you want to create. Our AI understands complex math concepts.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    title: "Generate and Render",
    description: "Our AI generates Manim code from your description. With one click, render the animation using the Manim engine.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: "Download and Share",
    description: "Download your animation as an MP4 video. Share your creation with colleagues, students, or on social media.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
];

export default IndexPage; 