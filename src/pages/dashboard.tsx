import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import useScriptsStore, { ManimScript } from '@/store/scripts';
import useThemeStore from '@/store/theme';

interface PromptFormData {
  prompt: string;
}

const Dashboard: React.FC = () => {
  const [provider, setProvider] = useState<'gemini' | 'azure_openai'>('gemini');
  const [shouldExecute, setShouldExecute] = useState(true);
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { darkMode } = useThemeStore();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    generateScript, 
    currentScript, 
    fetchScript,
    scripts, 
    isLoading, 
    fetchScripts,
    error,
    clearCurrentScript 
  } = useScriptsStore();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromptFormData>();
  
  // Function to create a new chat
  const createNewChat = () => {
    // Clear the selected script ID
    setSelectedScriptId(null);
    
    // Clear the current script in the store
    clearCurrentScript();
    
    // Reset the form
    reset();
    
    // Show a notification when new chat is created
    toast.success('Started a new chat', {
      icon: '🔄',
      duration: 2000,
      style: {
        borderRadius: '10px',
        background: darkMode ? '#374151' : '#fff',
        color: darkMode ? '#fff' : '#374151',
      },
    });
    
    // On mobile, close the sidebar after creating a new chat
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };
  
  // Keyboard shortcut for new chat (Ctrl+N / Cmd+N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault(); // Prevent default browser action
        createNewChat();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Load scripts on mount
  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);
  
  // Scroll to bottom of chat when a new message is added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentScript]);
  
  // Load selected script when ID changes
  useEffect(() => {
    if (selectedScriptId) {
      fetchScript(selectedScriptId);
    }
  }, [selectedScriptId, fetchScript]);
  
  const onSubmit = async (data: PromptFormData) => {
    try {
      const result = await generateScript({
        prompt: data.prompt,
        provider,
        execute: shouldExecute,
      });
      if (result) {
        setSelectedScriptId(result.id);
      }
      reset();
    } catch (err) {
      toast.error('Failed to generate script. Please try again.');
    }
  };
  
  // Calculate which script to display
  // Only show a script if we have a current script selected or a selectedScriptId
  const displayedScript = currentScript || 
    (scripts.length > 0 && selectedScriptId ? 
      scripts.find(s => s.id === selectedScriptId) : null);
  
  return (
    <Layout requireAuth withoutPadding hideFooter>
      <Head>
        <title>Dashboard | Omega</title>
        <meta name="description" content="Generate and manage your mathematical animations with Omega." />
      </Head>
      
      <div className="flex h-screen overflow-hidden">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-20 left-4 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Sidebar */}
        <aside 
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            fixed lg:static inset-y-0 left-0 lg:translate-x-0 z-30
            w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
            transform transition-transform duration-200 ease-in-out
            flex flex-col h-full pt-16`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">History</h2>
            <button
              onClick={createNewChat}
              className="p-2 px-3 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors flex items-center space-x-1"
              aria-label="New chat"
              title="New chat (Ctrl+N)"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm">New</span>
            </button>
          </div>
          
          {/* History list - independently scrollable */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
            {scripts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="mt-2">No history yet</p>
                <p className="text-sm mt-1">Your generated animations will appear here</p>
              </div>
            ) : (
              <AnimatePresence>
                {scripts.map((script) => (
                  <motion.button
                    key={script.id}
                    onClick={() => setSelectedScriptId(script.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-3 rounded-lg ${
                      selectedScriptId === script.id 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-transparent'
                    } transition-all duration-200`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate max-w-[180px] text-gray-900 dark:text-gray-100">
                          {script.prompt && script.prompt.length > 30 
                            ? script.prompt.substring(0, 30) + '...' 
                            : script.prompt || 'No prompt'}
                        </span>
                        <span className={`ml-2 flex-shrink-0 h-2.5 w-2.5 rounded-full ${
                          script.status === 'completed' 
                            ? 'bg-green-500' 
                            : script.status === 'failed'
                            ? 'bg-red-500'
                            : 'bg-amber-500 animate-pulse'
                        }`} />
                      </div>
                      <div className="mt-1.5 flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(script.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          {script.provider === 'gemini' ? 'Gemini' : 'OpenAI'}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Provider</span>
                <select 
                  className="form-select text-sm rounded-md border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                             focus:ring-blue-500 focus:border-blue-500"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as 'gemini' | 'azure_openai')}
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="azure_openai">Azure OpenAI</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Execute Animation</span>
                <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={shouldExecute}
                  onChange={() => setShouldExecute(!shouldExecute)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                  peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer 
                                  dark:bg-gray-700 peer-checked:after:translate-x-full 
                                  peer-checked:after:border-white after:content-[''] after:absolute 
                                  after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                                  after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                                  dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col h-full pt-16 lg:pt-0 relative bg-gray-50 dark:bg-gray-900">
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* New Chat floating button for mobile */}
          {displayedScript && (
            <div className="fixed bottom-28 right-4 z-40 lg:hidden">
              <button
                onClick={createNewChat}
                className="p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
                aria-label="New chat"
                title="New chat (Ctrl+N)"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Chat content area - scrollable */}
          <div className="flex-1 overflow-y-auto pb-[120px]">
            {!displayedScript && !isLoading ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-6 w-full max-w-md">
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-5 rounded-xl mb-4">
                    <svg className="h-16 w-16 mx-auto text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Visualize Mathematics</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Create stunning mathematical animations powered by AI. Simply describe what you want to visualize.
                  </p>
                  <ul className="space-y-3 text-sm text-left mb-6">
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Generate complex mathematical animations
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Choose between different AI models
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      View source code and rendered animations
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              displayedScript && (
                <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
                  {/* User prompt */}
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-3 bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 flex-1 shadow-sm border border-gray-100 dark:border-gray-700">
                      <p className="text-gray-900 dark:text-white text-base">{displayedScript.prompt}</p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(displayedScript.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* AI response */}
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white shadow-md">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3 bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 flex-1 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900 dark:text-white">Omega Assistant</p>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({displayedScript.provider})</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          displayedScript.status === 'completed' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                            : displayedScript.status === 'failed'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                        }`}>
                          {displayedScript.status === 'completed' 
                            ? 'Completed' 
                            : displayedScript.status === 'failed' 
                            ? 'Failed' 
                            : 'Processing'}
                        </span>
                      </div>
                      
                      {displayedScript.status === 'failed' ? (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg p-4 mb-4">
                          <div className="flex">
                            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm">{displayedScript.error_message || 'Failed to generate script'}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Video player (if available) */}
                          {displayedScript.output_url && (
                            <div className="mt-5 bg-black rounded-lg overflow-hidden shadow-lg">
                              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 text-white">
                                <h3 className="text-sm font-medium">Generated Animation</h3>
                              </div>
                              <div className="relative pt-[56.25%]">
                                <video
                                  controls
                                  className="absolute top-0 left-0 w-full h-full rounded-b-lg"
                                  src={displayedScript.output_url}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
            
            {isLoading && (
              <div className="flex flex-col justify-center items-center py-12 h-64">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
                </div>
                <span className="mt-4 text-gray-600 dark:text-gray-300">
                  Generating your animation...
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-xs text-center">
                  This may take a minute or two depending on the complexity of your request
                </span>
              </div>
            )}
            
            <div ref={chatEndRef} />
        </div>
        
          {/* Input area - fixed at bottom */}
          <motion.div 
            className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 absolute bottom-0 left-0 right-0 shadow-lg dark:shadow-gray-900/50"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="relative">
              <Textarea
                placeholder="Describe the mathematical animation you want to create..."
                  className="pr-28 min-h-[100px] resize-none rounded-2xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors shadow-sm"
                {...register('prompt', { required: 'Please enter a prompt' })}
                error={errors.prompt?.message}
              />
                {error && <p className="text-red-500 dark:text-red-400 mt-2 text-sm">{error}</p>}
                <div className="absolute bottom-3 right-3">
                <Button
                  type="submit"
                  variant="primary"
                    size="md"
                  isLoading={isLoading}
                  disabled={isLoading}
                    className="rounded-full px-5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                >
                    <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                    Generate
                </Button>
              </div>
            </form>
          </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 