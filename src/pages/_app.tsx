import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import useThemeStore from '@/store/theme';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  // We'll use a client-side effect to initialize the theme store
  // since we can't directly access the store here in the App component
  
  useEffect(() => {
    // Remove server-side injected CSS when using Material-UI
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    
    // Theme is now initialized in the Layout component
  }, []);
  
  // For Toaster, we need to get the current state directly from localStorage
  // since useState won't work properly in server-side rendering
  const isDarkMode = 
    typeof window !== 'undefined' ? 
      localStorage.getItem('darkMode') === 'true' : 
      false;

  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content={isDarkMode ? '#1F2937' : '#FFFFFF'} />
      </Head>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode ? '#374151' : '#FFFFFF',
            color: isDarkMode ? '#F9FAFB' : '#1F2937',
            boxShadow: isDarkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0.5rem',
            border: isDarkMode ? '1px solid #4B5563' : 'none',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: isDarkMode ? '#374151' : '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: isDarkMode ? '#374151' : '#FFFFFF',
            },
          },
          duration: 4000,
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 