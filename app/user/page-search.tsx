'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, SlidersHorizontal, Grid, List, Calendar,
  DollarSign, User, FileText, TrendingUp, Activity, Clock,
  ChevronRight, Eye, Download, Share2, Star, Bookmark, X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserDashboard } from '@/hooks/useDashboardData';
import { SearchBar, AdvancedSearchBar } from '@/components/ui/SearchBar';
import { FilterPanel } from '@/components/ui/FilterPanel';
import { useSearchAndFilter, FilterOption, Filter as FilterType } from '@/lib/search-utils';
// UserLayout is already applied by ConditionalLayout based on user role
import { DashboardLoading } from '@/components/ui/LoadingStates';
import { DashboardErrorBoundary } from '@/components/error/ErrorBoundary';
import { format } from 'date-fns';

// Sample filter options
const filterOptions: FilterOption[] = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'ACTIVE' },
      { label: 'Pending', value: 'PENDING' },
      { label: 'Completed', value: 'COMPLETED' },
      { label: 'Overdue', value: 'OVERDUE' }
    ]
  },
  {
    id: 'type',
    label: 'Loan Type',
    type: 'select',
    options: [
      { label: 'Personal Loan', value: 'PERSONAL' },
      { label: 'Business Loan', value: 'BUSINESS' },
      { label: 'Gold Loan', value: 'GOLD' },
      { label: 'Home Loan', value: 'HOME' }
    ]
  },
  {
    id: 'amount',
    label: 'Amount Range',
    type: 'range',
    value: [0, 1000000]
  },
  {
    id: 'dateRange',
    label: 'Date Range',
    type: 'date'
  },
  {
    id: 'hasDocuments',
    label: 'Has Documents',
    type: 'boolean'
  },
  {
    id: 'isUrgent',
    label: 'Urgent',
    type: 'boolean'
  }
];

function SearchDashboardContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data, loading, error } = useUserDashboard();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Prepare searchable data
  const searchableData = data ? [
    ...data.loans.active.map((loan: any) => ({
      ...loan,
      category: 'loan',
      searchableText: `${loan.type} ${loan.status} ${loan.amount} ${loan.id}`
    })),
    ...data.recentTransactions.map((txn: any) => ({
      ...txn,
      category: 'transaction',
      searchableText: `${txn.type} ${txn.description} ${txn.amount} ${txn.status}`
    })),
    ...data.quickActions.map((action: any) => ({
      ...action,
      category: 'action',
      searchableText: `${action.title} ${action.description}`
    }))
  ] : [];

  // Use search and filter hook
  const {
    query,
    setQuery,
    filters,
    setFilters,
    sort,
    setSort,
    results,
    addFilter,
    removeFilter,
    clearFilters
  } = useSearchAndFilter(searchableData, {
    fields: ['searchableText', 'type', 'status', 'description'],
    fuzzy: true,
    threshold: 0.6
  });

  // Check authentication
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'USER')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Handle search
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setSearchQuery(searchQuery);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: FilterType[]) => {
    setFilters(newFilters);
  };

  if (authLoading || loading) {
    return <DashboardLoading role="USER" message="Loading search dashboard..." />;
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-slate-400">Unable to load dashboard</p>
        </div>
      </div>
    );
  }

  // Group results by category
  const groupedResults = results.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Filters Sidebar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-r border-slate-800 overflow-hidden"
          >
            <div className="w-80 h-full overflow-y-auto p-4">
              <FilterPanel
                filters={filterOptions}
                activeFilters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearFilters}
                variant="sidebar"
              />

              {/* Sort Options */}
              <div className="mt-6 bg-slate-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-3">Sort By</h4>
                <select
                  className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split(':');
                    setSort({ field, direction: direction as 'asc' | 'desc' });
                  }}
                >
                  <option value="">Default</option>
                  <option value="amount:desc">Amount (High to Low)</option>
                  <option value="amount:asc">Amount (Low to High)</option>
                  <option value="date:desc">Date (Newest First)</option>
                  <option value="date:asc">Date (Oldest First)</option>
                  <option value="type:asc">Type (A-Z)</option>
                  <option value="status:asc">Status (A-Z)</option>
                </select>
              </div>

              {/* Statistics */}
              <div className="mt-6 bg-slate-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-3">Results Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Results</span>
                    <span className="text-white font-medium">{results.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Filters</span>
                    <span className="text-white font-medium">{filters.length}</span>
                  </div>
                  {Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-slate-400 capitalize">{category}s</span>
                      <span className="text-white font-medium">{items.length}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
              <Search className="w-6 h-6" />
              <span>Search & Filter Dashboard</span>
            </h1>

            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-slate-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-slate-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <AdvancedSearchBar
            onSearch={handleSearch}
            className="max-w-4xl"
          />

          {/* Quick Filters */}
          <div className="flex items-center space-x-2 mt-4 overflow-x-auto pb-2">
            <span className="text-xs text-slate-400 flex-shrink-0">Quick Filters:</span>
            <button
              onClick={() => addFilter({ field: 'status', operator: 'equals', value: 'ACTIVE', label: 'Active' })}
              className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full hover:bg-green-500/20 transition-colors whitespace-nowrap"
            >
              Active Only
            </button>
            <button
              onClick={() => addFilter({ field: 'type', operator: 'equals', value: 'PERSONAL', label: 'Personal Loans' })}
              className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full hover:bg-blue-500/20 transition-colors whitespace-nowrap"
            >
              Personal Loans
            </button>
            <button
              onClick={() => addFilter({ field: 'isUrgent', operator: 'equals', value: true, label: 'Urgent' })}
              className="px-3 py-1 bg-red-500/10 text-red-400 text-xs rounded-full hover:bg-red-500/20 transition-colors whitespace-nowrap"
            >
              Urgent
            </button>
            <button
              onClick={() => {
                const lastWeek = new Date();
                lastWeek.setDate(lastWeek.getDate() - 7);
                addFilter({
                  field: 'date',
                  operator: 'after',
                  value: lastWeek.toISOString(),
                  label: 'Last 7 Days'
                });
              }}
              className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full hover:bg-purple-500/20 transition-colors whitespace-nowrap"
            >
              Last 7 Days
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Search Summary */}
          {(query || filters.length > 0) && (
            <div className="mb-6 bg-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-white">
                    {results.length} Results
                    {query && <span className="text-slate-400"> for "{query}"</span>}
                  </h2>
                  {filters.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {filters.map((filter) => (
                        <span
                          key={filter.field}
                          className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center space-x-1"
                        >
                          <span>{filter.label}</span>
                          <button
                            onClick={() => removeFilter(filter.field)}
                            className="hover:text-blue-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setQuery('');
                    clearFilters();
                  }}
                  className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Results Grid/List */}
          {results.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {results.map((item, index) => (
                <SearchResultCard
                  key={index}
                  item={item}
                  viewMode={viewMode}
                  searchQuery={query}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Results Found</h3>
              <p className="text-slate-400 mb-6">
                {query
                  ? `No results match "${query}"`
                  : 'Try adjusting your filters or search terms'}
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  clearFilters();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Search result card component
function SearchResultCard({
  item,
  viewMode,
  searchQuery
}: {
  item: any;
  viewMode: 'grid' | 'list';
  searchQuery: string;
}) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'loan':
        return <DollarSign className="w-4 h-4" />;
      case 'transaction':
        return <Activity className="w-4 h-4" />;
      case 'action':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'loan':
        return 'text-green-400 bg-green-500/10';
      case 'transaction':
        return 'text-blue-400 bg-blue-500/10';
      case 'action':
        return 'text-purple-400 bg-purple-500/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  // Highlight search query in text
  const highlightText = (text: string) => {
    if (!searchQuery) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-500/30 text-yellow-400">{part}</mark>
      ) : (
        part
      )
    );
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg ${getCategoryColor(item.category)}`}>
              {getCategoryIcon(item.category)}
            </div>
            <div>
              <h3 className="font-medium text-white">
                {highlightText(item.type || item.title || 'Item')}
              </h3>
              <p className="text-sm text-slate-400">
                {highlightText(item.description || item.status || '')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {item.amount && (
              <span className="text-lg font-semibold text-white">
                ₹{item.amount.toLocaleString()}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${getCategoryColor(item.category)}`}>
          {getCategoryIcon(item.category)}
        </div>
        <span className="text-xs text-slate-500 capitalize">{item.category}</span>
      </div>

      <h3 className="font-medium text-white mb-1">
        {highlightText(item.type || item.title || 'Item')}
      </h3>
      <p className="text-sm text-slate-400 mb-3">
        {highlightText(item.description || item.status || '')}
      </p>

      {item.amount && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
          <span className="text-sm text-slate-400">Amount</span>
          <span className="text-lg font-semibold text-white">
            ₹{item.amount.toLocaleString()}
          </span>
        </div>
      )}

      {item.date && (
        <div className="flex items-center justify-between pt-2">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-400">
            {format(new Date(item.date), 'dd MMM yyyy')}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
        <button className="p-1.5 rounded hover:bg-slate-600 transition-colors">
          <Eye className="w-4 h-4 text-slate-400" />
        </button>
        <button className="p-1.5 rounded hover:bg-slate-600 transition-colors">
          <Star className="w-4 h-4 text-slate-400" />
        </button>
        <button className="p-1.5 rounded hover:bg-slate-600 transition-colors">
          <Share2 className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </motion.div>
  );
}

export default function SearchDashboard() {
  return (
    <DashboardErrorBoundary>
      <>
        <SearchDashboardContent />
      </>
    </DashboardErrorBoundary>
  );
}