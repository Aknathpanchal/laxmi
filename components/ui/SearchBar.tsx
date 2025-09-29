'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Filter, Save, Clock, Star, TrendingUp,
  Command, ArrowRight, Loader2, Sparkles
} from 'lucide-react';
import { useSearch, SavedSearch, useSavedSearches } from '@/lib/search-utils';

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  suggestions?: string[];
  recentSearches?: string[];
  showFilters?: boolean;
  onFilterClick?: () => void;
  className?: string;
  variant?: 'default' | 'minimal' | 'advanced';
  autoFocus?: boolean;
}

export function SearchBar({
  placeholder = 'Search...',
  onSearch,
  onClear,
  suggestions = [],
  recentSearches = [],
  showFilters = false,
  onFilterClick,
  className = '',
  variant = 'default',
  autoFocus = false
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedIndex(-1);

    if (onSearch) {
      setIsSearching(true);
      // Debounce search
      const timeoutId = setTimeout(() => {
        onSearch(value);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
    if (onClear) {
      onClear();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const filteredSuggestions = suggestions.filter(s =>
      s.toLowerCase().includes(query.toLowerCase())
    );

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSearch(filteredSuggestions[selectedIndex]);
        setShowSuggestions(false);
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="w-full bg-transparent border-b border-slate-700 focus:border-blue-500 px-8 py-2 text-white placeholder-slate-500 outline-none transition-colors"
          />
          <Search className="absolute left-0 top-2.5 w-4 h-4 text-slate-400" />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-0 top-2.5 p-0.5 rounded hover:bg-slate-700 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative flex items-center bg-slate-800 rounded-lg border transition-all ${
          isFocused
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        <div className="pl-3 pr-2">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-slate-400" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(query.length > 0 || recentSearches.length > 0);
          }}
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false);
              setShowSuggestions(false);
            }, 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-2 text-white placeholder-slate-400 outline-none"
        />

        <div className="flex items-center pr-2 space-x-1">
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="p-1.5 rounded hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </motion.button>
          )}

          {showFilters && (
            <button
              onClick={onFilterClick}
              className="p-1.5 rounded hover:bg-slate-700 transition-colors"
            >
              <Filter className="w-4 h-4 text-slate-400" />
            </button>
          )}

          <div className="flex items-center space-x-1 text-xs text-slate-500 pl-2 border-l border-slate-700">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuggestions && (filteredSuggestions.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-lg border border-slate-700 shadow-xl z-50 overflow-hidden"
          >
            {query.length === 0 && recentSearches.length > 0 && (
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">Recent Searches</span>
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                </div>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-700 transition-colors flex items-center space-x-2"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-sm text-slate-300">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {filteredSuggestions.length > 0 && (
              <div className="p-3">
                {query.length > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">Suggestions</span>
                    <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                )}
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleSearch(suggestion);
                      setShowSuggestions(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded transition-colors flex items-center justify-between ${
                      selectedIndex === index
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-sm">{suggestion}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Advanced search component with autocomplete
export function AdvancedSearchBar({
  onSearch,
  onSaveSearch,
  className = ''
}: {
  onSearch: (query: string, filters?: any) => void;
  onSaveSearch?: (search: Omit<SavedSearch, 'id' | 'createdAt'>) => void;
  className?: string;
}) {
  const [query, setQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');
  const { savedSearches, saveSearch, loadSearch } = useSavedSearches();

  const handleSave = () => {
    if (searchName && query) {
      const saved = saveSearch({
        name: searchName,
        query,
        filters: [],
        description: `Search for: ${query}`
      });

      if (onSaveSearch) {
        onSaveSearch(saved);
      }

      setShowSaveDialog(false);
      setSearchName('');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <SearchBar
          placeholder="Advanced search..."
          onSearch={onSearch}
          variant="default"
          showFilters
          onFilterClick={() => setShowAdvanced(!showAdvanced)}
          className="flex-1"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSaveDialog(!showSaveDialog)}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          title="Save search"
        >
          <Save className="w-4 h-4 text-slate-300" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800 rounded-lg p-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Date Range</label>
                <select className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm">
                  <option>All Time</option>
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                  <option>Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Type</label>
                <select className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm">
                  <option>All Types</option>
                  <option>Loans</option>
                  <option>Payments</option>
                  <option>Applications</option>
                  <option>Documents</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Status</label>
                <select className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowAdvanced(false)}
                className="text-sm text-slate-400 hover:text-slate-300"
              >
                Hide Advanced Options
              </button>

              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-300 transition-colors">
                  Reset
                </button>
                <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-800 rounded-lg p-4 space-y-3"
          >
            <h3 className="text-sm font-medium text-white">Save Search</h3>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter search name..."
              className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
            />
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {savedSearches.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <span className="text-xs text-slate-400 flex-shrink-0">Saved:</span>
          {savedSearches.map((search) => (
            <button
              key={search.id}
              onClick={() => {
                setQuery(search.query);
                onSearch(search.query);
              }}
              className="flex items-center space-x-1 px-3 py-1 bg-slate-700/50 hover:bg-slate-700 rounded-full text-xs text-slate-300 whitespace-nowrap transition-colors"
            >
              <Star className="w-3 h-3" />
              <span>{search.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}