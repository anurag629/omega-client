import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import useScriptsStore, { ManimScript } from '@/store/scripts';

interface ScriptFilter {
  status: 'all' | 'completed' | 'pending' | 'failed';
  provider: 'all' | 'gemini' | 'azure_openai';
  sortBy: 'newest' | 'oldest';
}

const HistoryPage: React.FC = () => {
  const router = useRouter();
  const { scripts, fetchScripts, isLoading, error } = useScriptsStore();
  const [filters, setFilters] = useState<ScriptFilter>({
    status: 'all',
    provider: 'all',
    sortBy: 'newest',
  });
  const [filteredScripts, setFilteredScripts] = useState<ManimScript[]>([]);
  
  // Load scripts on mount
  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);
  
  // Apply filters
  useEffect(() => {
    let result = [...scripts];
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(script => script.status === filters.status);
    }
    
    // Apply provider filter
    if (filters.provider !== 'all') {
      result = result.filter(script => script.provider === filters.provider);
    }
    
    // Apply sorting
    result = result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return filters.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredScripts(result);
  }, [scripts, filters]);
  
  // Handle filter change
  const handleFilterChange = (name: keyof ScriptFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  return (
    <Layout requireAuth>
      <Head>
        <title>Script History | Omega</title>
        <meta name="description" content="View your history of Manim scripts and animations." />
      </Head>
      
      <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-2xl font-bold text-secondary-900 mb-4 md:mb-0">Script History</h1>
            
            <div className="flex flex-wrap gap-4">
              {/* Status filter */}
              <div className="flex items-center space-x-2">
                <label htmlFor="status-filter" className="text-sm font-medium text-secondary-700">
                  Status:
                </label>
                <select
                  id="status-filter"
                  className="form-input py-1 text-sm"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              {/* Provider filter */}
              <div className="flex items-center space-x-2">
                <label htmlFor="provider-filter" className="text-sm font-medium text-secondary-700">
                  Provider:
                </label>
                <select
                  id="provider-filter"
                  className="form-input py-1 text-sm"
                  value={filters.provider}
                  onChange={(e) => handleFilterChange('provider', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="azure_openai">Azure OpenAI</option>
                </select>
              </div>
              
              {/* Sort filter */}
              <div className="flex items-center space-x-2">
                <label htmlFor="sort-filter" className="text-sm font-medium text-secondary-700">
                  Sort:
                </label>
                <select
                  id="sort-filter"
                  className="form-input py-1 text-sm"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredScripts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md p-8 text-center"
            >
              <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-secondary-900">No scripts found</h3>
              <p className="mt-1 text-secondary-500">
                {scripts.length === 0 ? "You haven't created any scripts yet." : "No scripts match your current filters."}
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="primary"
                >
                  Create a New Script
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredScripts.map((script) => (
                <ScriptCard key={script.id} script={script} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

interface ScriptCardProps {
  script: ManimScript;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script }) => {
  const router = useRouter();
  
  // Truncate prompt for display
  const truncatedPrompt = script.prompt?.length > 100
    ? script.prompt.substring(0, 100) + '...'
    : script.prompt || 'No prompt available';
  
  // Format date
  const formattedDate = new Date(script.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Status color
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-5">
        {/* Status and date */}
        <div className="flex justify-between items-center mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[script.status]}`}>
            {script.status === 'completed' ? 'Completed' : script.status === 'failed' ? 'Failed' : 'Processing'}
          </span>
          <span className="text-xs text-secondary-500">{formattedDate}</span>
        </div>
        
        {/* Prompt */}
        <h3 className="text-lg font-medium text-secondary-900 mb-2 line-clamp-2">
          {truncatedPrompt}
        </h3>
        
        {/* Provider */}
        <div className="flex items-center text-sm text-secondary-500 mb-4">
          <span className="mr-2">
            {script.provider === 'gemini' ? 'Google Gemini' : 'Azure OpenAI'}
          </span>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/dashboard?script=${script.id}`)}
          >
            View Details
          </Button>
          
          {script.output_url && (
            <a
              href={script.output_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              View Animation
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryPage; 