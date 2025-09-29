import { useState, useEffect, useCallback, useMemo } from 'react';

// Search types and interfaces
export interface SearchOptions {
  fuzzy?: boolean;
  caseSensitive?: boolean;
  exactMatch?: boolean;
  fields?: string[];
  limit?: number;
  threshold?: number;
}

export interface FilterOption {
  id: string;
  label: string;
  value: any;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'range';
  options?: { label: string; value: any }[];
  operator?: 'equals' | 'contains' | 'gt' | 'lt' | 'between' | 'in';
}

export interface Filter {
  field: string;
  operator: string;
  value: any;
  label?: string;
}

export interface SearchResult<T = any> {
  item: T;
  score: number;
  matches?: string[];
  highlights?: { [key: string]: string };
}

export interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  query: string;
  filters: Filter[];
  sort?: SortConfig;
  createdAt: Date;
  isDefault?: boolean;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// Fuzzy search implementation
export class FuzzySearch<T extends Record<string, any>> {
  private items: T[];
  private options: SearchOptions;
  private searchableFields: string[];

  constructor(items: T[], options: SearchOptions = {}) {
    this.items = items;
    this.options = {
      fuzzy: true,
      caseSensitive: false,
      exactMatch: false,
      fields: [],
      limit: 100,
      threshold: 0.6,
      ...options
    };
    this.searchableFields = this.options.fields || this.extractFields(items[0] || {});
  }

  private extractFields(obj: any, prefix = ''): string[] {
    const fields: string[] = [];

    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'string' || typeof obj[key] === 'number') {
        fields.push(fullKey);
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        fields.push(...this.extractFields(obj[key], fullKey));
      }
    }

    return fields;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private calculateScore(query: string, text: string): number {
    if (!text || !query) return 0;

    const normalizedQuery = this.options.caseSensitive ? query : query.toLowerCase();
    const normalizedText = this.options.caseSensitive ? text : text.toLowerCase();

    if (this.options.exactMatch) {
      return normalizedText === normalizedQuery ? 1 : 0;
    }

    if (normalizedText.includes(normalizedQuery)) {
      return 0.9 + (normalizedQuery.length / normalizedText.length) * 0.1;
    }

    if (!this.options.fuzzy) return 0;

    // Fuzzy matching using Levenshtein distance
    const distance = this.levenshteinDistance(normalizedQuery, normalizedText);
    const maxLength = Math.max(normalizedQuery.length, normalizedText.length);
    const similarity = 1 - (distance / maxLength);

    return similarity;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private highlightMatch(text: string, query: string): string {
    if (!text || !query) return text;

    const regex = new RegExp(`(${query})`, this.options.caseSensitive ? 'g' : 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  search(query: string): SearchResult<T>[] {
    if (!query.trim()) {
      return this.items.map(item => ({
        item,
        score: 1,
        matches: [],
        highlights: {}
      }));
    }

    const results: SearchResult<T>[] = [];

    for (const item of this.items) {
      let totalScore = 0;
      const matches: string[] = [];
      const highlights: { [key: string]: string } = {};

      for (const field of this.searchableFields) {
        const value = this.getNestedValue(item, field);
        if (value === null || value === undefined) continue;

        const textValue = String(value);
        const score = this.calculateScore(query, textValue);

        if (score >= (this.options.threshold || 0.6)) {
          totalScore += score;
          matches.push(field);
          highlights[field] = this.highlightMatch(textValue, query);
        }
      }

      if (totalScore > 0) {
        results.push({
          item,
          score: totalScore / matches.length,
          matches,
          highlights
        });
      }
    }

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    // Apply limit
    return results.slice(0, this.options.limit);
  }
}

// Filter utilities
export class FilterEngine<T extends Record<string, any>> {
  private items: T[];

  constructor(items: T[]) {
    this.items = items;
  }

  apply(filters: Filter[]): T[] {
    if (!filters.length) return this.items;

    return this.items.filter(item => {
      return filters.every(filter => this.evaluateFilter(item, filter));
    });
  }

  private evaluateFilter(item: T, filter: Filter): boolean {
    const value = this.getNestedValue(item, filter.field);
    const filterValue = filter.value;

    switch (filter.operator) {
      case 'equals':
        return value === filterValue;

      case 'contains':
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());

      case 'gt':
        return Number(value) > Number(filterValue);

      case 'lt':
        return Number(value) < Number(filterValue);

      case 'gte':
        return Number(value) >= Number(filterValue);

      case 'lte':
        return Number(value) <= Number(filterValue);

      case 'between':
        const [min, max] = filterValue;
        return Number(value) >= Number(min) && Number(value) <= Number(max);

      case 'in':
        return Array.isArray(filterValue) ? filterValue.includes(value) : false;

      case 'notIn':
        return Array.isArray(filterValue) ? !filterValue.includes(value) : true;

      case 'startsWith':
        return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());

      case 'endsWith':
        return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());

      case 'before':
        return new Date(value) < new Date(filterValue);

      case 'after':
        return new Date(value) > new Date(filterValue);

      case 'regex':
        try {
          const regex = new RegExp(filterValue, 'i');
          return regex.test(String(value));
        } catch {
          return false;
        }

      default:
        return true;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Sort utilities
export function sortData<T>(data: T[], config: SortConfig): T[] {
  const sorted = [...data];

  sorted.sort((a: any, b: any) => {
    const aValue = getNestedValue(a, config.field);
    const bValue = getNestedValue(b, config.field);

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    let comparison = 0;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return config.direction === 'desc' ? -comparison : comparison;
  });

  return sorted;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Search hooks
export function useSearch<T extends Record<string, any>>(
  items: T[],
  options?: SearchOptions
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult<T>[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchEngine = useMemo(
    () => new FuzzySearch(items, options),
    [items, options]
  );

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    setIsSearching(true);

    // Debounced search
    const timeoutId = setTimeout(() => {
      const searchResults = searchEngine.search(searchQuery);
      setResults(searchResults);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchEngine]);

  useEffect(() => {
    const cleanup = search(query);
    return cleanup;
  }, [query, search]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    search
  };
}

// Filter hook
export function useFilters<T extends Record<string, any>>(
  items: T[],
  initialFilters: Filter[] = []
) {
  const [filters, setFilters] = useState<Filter[]>(initialFilters);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);

  const filterEngine = useMemo(
    () => new FilterEngine(items),
    [items]
  );

  useEffect(() => {
    const filtered = filterEngine.apply(filters);
    setFilteredItems(filtered);
  }, [filters, filterEngine]);

  const addFilter = useCallback((filter: Filter) => {
    setFilters(prev => [...prev, filter]);
  }, []);

  const removeFilter = useCallback((field: string) => {
    setFilters(prev => prev.filter(f => f.field !== field));
  }, []);

  const updateFilter = useCallback((field: string, updates: Partial<Filter>) => {
    setFilters(prev =>
      prev.map(f => f.field === field ? { ...f, ...updates } : f)
    );
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  return {
    filters,
    filteredItems,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    setFilters
  };
}

// Combined search and filter hook
export function useSearchAndFilter<T extends Record<string, any>>(
  items: T[],
  searchOptions?: SearchOptions
) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filter[]>([]);
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [results, setResults] = useState<T[]>(items);

  useEffect(() => {
    let processed = [...items];

    // Apply search
    if (query) {
      const searchEngine = new FuzzySearch(processed, searchOptions);
      const searchResults = searchEngine.search(query);
      processed = searchResults.map(r => r.item);
    }

    // Apply filters
    if (filters.length > 0) {
      const filterEngine = new FilterEngine(processed);
      processed = filterEngine.apply(filters);
    }

    // Apply sort
    if (sort) {
      processed = sortData(processed, sort);
    }

    setResults(processed);
  }, [items, query, filters, sort, searchOptions]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    sort,
    setSort,
    results,
    addFilter: (filter: Filter) => setFilters(prev => [...prev, filter]),
    removeFilter: (field: string) => setFilters(prev => prev.filter(f => f.field !== field)),
    clearFilters: () => setFilters([]),
    clearAll: () => {
      setQuery('');
      setFilters([]);
      setSort(null);
    }
  };
}

// Saved searches management
export function useSavedSearches(storageKey = 'saved_searches') {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedSearches(parsed);
      } catch (error) {
        console.error('Failed to parse saved searches:', error);
      }
    }
  }, [storageKey]);

  const saveSearch = useCallback((search: Omit<SavedSearch, 'id' | 'createdAt'>) => {
    const newSearch: SavedSearch = {
      ...search,
      id: `search_${Date.now()}`,
      createdAt: new Date()
    };

    setSavedSearches(prev => {
      const updated = [...prev, newSearch];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });

    return newSearch;
  }, [storageKey]);

  const deleteSearch = useCallback((id: string) => {
    setSavedSearches(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }, [storageKey]);

  const loadSearch = useCallback((id: string) => {
    return savedSearches.find(s => s.id === id);
  }, [savedSearches]);

  return {
    savedSearches,
    saveSearch,
    deleteSearch,
    loadSearch
  };
}