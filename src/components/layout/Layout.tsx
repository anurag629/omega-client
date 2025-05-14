import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './Footer';
import useAuthStore from '@/store/auth';
import useThemeStore from '@/store/theme';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  hideNavbar?: boolean;
  hideFooter?: boolean;
  withoutPadding?: boolean;
  className?: string;
}

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.3 } },
};

const Layout: React.FC<LayoutProps> = ({
  children,
  requireAuth = false,
  hideNavbar = false,
  hideFooter = false,
  withoutPadding = false,
  className = '',
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, initAuth } = useAuthStore();
  const { initTheme, cleanupTheme } = useThemeStore();

  // Initialize auth and theme state
  useEffect(() => {
    initAuth();
    initTheme();
    
    // Clean up theme listener on unmount
    return () => {
      cleanupTheme();
    };
  }, [initAuth, initTheme, cleanupTheme]);

  // Handle auth check
  useEffect(() => {
    // Skip auth check on auth-related pages
    const isAuthPage = ['/login', '/register', '/waitlist', '/verify-email'].includes(router.pathname);
    
    if (requireAuth && !isLoading && !isAuthenticated && !isAuthPage) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  // Handle loading state
  if (requireAuth && isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-blue-200 dark:bg-blue-800 h-16 w-16 mb-4"></div>
          <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      {!hideNavbar && <Navbar />}
      <motion.main
        className={`flex-grow ${!withoutPadding ? 'p-4 md:p-6' : ''} ${!hideNavbar ? 'pt-16' : ''}`}
        initial="hidden"
        animate="enter"
        variants={variants}
      >
        {children}
      </motion.main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout; 