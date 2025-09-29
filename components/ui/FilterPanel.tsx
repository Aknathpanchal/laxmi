'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, X, Plus, ChevronDown, ChevronUp, Calendar,
  DollarSign, Hash, ToggleLeft, ToggleRight, Sliders,
  Save, Trash2, RotateCcw, Check, AlertCircle
} from 'lucide-react';
import { Filter as FilterType, FilterOption, SavedSearch } from '@/lib/search-utils';

export interface FilterPanelProps {
  filters: FilterOption[];
  activeFilters: FilterType[];
  onFilterChange: (filters: FilterType[]) => void;
  onClearAll?: () => void;
  onSaveFilter?: (name: string, filters: FilterType[]) => void;
  savedFilters?: SavedSearch[];
  className?: string;
  variant?: 'sidebar' | 'dropdown' | 'inline';
}

export function FilterPanel({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  onSaveFilter,
  savedFilters = [],
  className = '',
  variant = 'sidebar'
}: FilterPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  const handleFilterToggle = (filter: FilterOption, value: any) => {
    const existingFilter = activeFilters.find(f => f.field === filter.id);

    if (existingFilter) {
      if (filter.type === 'select' && filter.options) {
        // For multi-select, toggle the value
        const currentValues = Array.isArray(existingFilter.value)
          ? existingFilter.value
          : [existingFilter.value];

        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];

        if (newValues.length === 0) {
          // Remove filter if no values selected
          onFilterChange(activeFilters.filter(f => f.field !== filter.id));
        } else {
          // Update filter with new values
          onFilterChange(
            activeFilters.map(f =>
              f.field === filter.id
                ? { ...f, value: newValues.length === 1 ? newValues[0] : newValues }
                : f
            )
          );
        }
      } else {
        // Remove filter
        onFilterChange(activeFilters.filter(f => f.field !== filter.id));
      }
    } else {
      // Add new filter
      onFilterChange([
        ...activeFilters,
        {
          field: filter.id,
          operator: filter.operator || 'equals',
          value,
          label: filter.label
        }
      ]);
    }
  };

  const handleRangeChange = (filter: FilterOption, min: number, max: number) => {
    const newFilter: FilterType = {
      field: filter.id,
      operator: 'between',
      value: [min, max],
      label: filter.label
    };

    onFilterChange([
      ...activeFilters.filter(f => f.field !== filter.id),
      newFilter
    ]);
  };

  const handleSaveFilters = () => {
    if (filterName && onSaveFilter) {
      onSaveFilter(filterName, activeFilters);
      setShowSaveDialog(false);
      setFilterName('');
    }
  };

  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  // Group filters by type
  const groupedFilters = filters.reduce((acc, filter) => {
    const group = filter.type;
    if (!acc[group]) acc[group] = [];
    acc[group].push(filter);
    return acc;
  }, {} as Record<string, FilterOption[]>);

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {filters.slice(0, 4).map((filter) => (
          <FilterChip
            key={filter.id}
            filter={filter}
            active={activeFilters.some(f => f.field === filter.id)}
            onClick={(value) => handleFilterToggle(filter, value)}
          />
        ))}
        {filters.length > 4 && (
          <button className="px-3 py-1 text-xs text-slate-400 hover:text-slate-300 transition-colors flex items-center space-x-1">
            <Plus className="w-3 h-3" />
            <span>More</span>
          </button>
        )}
        {activeFilters.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1 text-xs text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
          >
            <X className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-slate-800 rounded-lg p-4 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {activeFilters.length > 0 && (
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              {activeFilters.length}
            </span>
          )}
        </h3>

        <div className="flex items-center space-x-2">
          {activeFilters.length > 0 && (
            <button
              onClick={onClearAll}
              className="p-1.5 rounded hover:bg-slate-700 transition-colors"
              title="Clear all filters"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
            </button>
          )}
          {onSaveFilter && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="p-1.5 rounded hover:bg-slate-700 transition-colors"
              title="Save filters"
            >
              <Save className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-slate-400 font-medium">Saved Filters</span>
          <div className="space-y-1">
            {savedFilters.map((saved) => (
              <button
                key={saved.id}
                onClick={() => onFilterChange(saved.filters)}
                className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded text-sm text-slate-300 transition-colors flex items-center justify-between group"
              >
                <span>{saved.name}</span>
                <span className="text-xs text-slate-500 group-hover:text-slate-400">
                  {saved.filters.length} filters
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Groups */}
      <div className="space-y-3">
        {Object.entries(groupedFilters).map(([group, groupFilters]) => (
          <div key={group} className="border-b border-slate-700 last:border-0 pb-3 last:pb-0">
            <button
              onClick={() => toggleGroup(group)}
              className="w-full flex items-center justify-between py-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <span className="capitalize font-medium">{group} Filters</span>
              {expandedGroups.has(group) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <AnimatePresence>
              {expandedGroups.has(group) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 mt-2"
                >
                  {groupFilters.map((filter) => (
                    <FilterControl
                      key={filter.id}
                      filter={filter}
                      activeFilters={activeFilters}
                      onToggle={handleFilterToggle}
                      onRangeChange={handleRangeChange}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Active Filters Summary */}
      {activeFilters.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-slate-400 font-medium">Active Filters</span>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div
                key={filter.field}
                className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center space-x-1"
              >
                <span>{filter.label}: {Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}</span>
                <button
                  onClick={() => onFilterChange(activeFilters.filter(f => f.field !== filter.field))}
                  className="hover:text-blue-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-700 rounded-lg p-4 space-y-3"
          >
            <h4 className="text-sm font-medium text-white">Save Filter Set</h4>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Enter filter name..."
              className="w-full bg-slate-800 text-white rounded px-3 py-2 text-sm"
            />
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFilters}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Individual filter control component
function FilterControl({
  filter,
  activeFilters,
  onToggle,
  onRangeChange
}: {
  filter: FilterOption;
  activeFilters: FilterType[];
  onToggle: (filter: FilterOption, value: any) => void;
  onRangeChange: (filter: FilterOption, min: number, max: number) => void;
}) {
  const isActive = activeFilters.some(f => f.field === filter.id);
  const activeValue = activeFilters.find(f => f.field === filter.id)?.value;

  switch (filter.type) {
    case 'boolean':
      return (
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-slate-300">{filter.label}</span>
          <button
            onClick={() => onToggle(filter, !isActive)}
            className={`p-1 rounded transition-colors ${
              isActive ? 'text-blue-400' : 'text-slate-500'
            }`}
          >
            {isActive ? (
              <ToggleRight className="w-5 h-5" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <span className="text-sm text-slate-300">{filter.label}</span>
          <div className="space-y-1">
            {filter.options?.map((option) => {
              const isChecked = Array.isArray(activeValue)
                ? activeValue.includes(option.value)
                : activeValue === option.value;

              return (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 py-1 cursor-pointer hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggle(filter, option.value)}
                    className="rounded border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-slate-700"
                  />
                  <span className="text-sm text-slate-300">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      );

    case 'range':
      return (
        <div className="space-y-2">
          <span className="text-sm text-slate-300">{filter.label}</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-24 bg-slate-700 text-white rounded px-2 py-1 text-sm"
              onChange={(e) => {
                const min = Number(e.target.value);
                const max = Array.isArray(activeValue) ? activeValue[1] : 0;
                onRangeChange(filter, min, max);
              }}
            />
            <span className="text-slate-500">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-24 bg-slate-700 text-white rounded px-2 py-1 text-sm"
              onChange={(e) => {
                const max = Number(e.target.value);
                const min = Array.isArray(activeValue) ? activeValue[0] : 0;
                onRangeChange(filter, min, max);
              }}
            />
          </div>
        </div>
      );

    case 'date':
      return (
        <div className="space-y-2">
          <span className="text-sm text-slate-300">{filter.label}</span>
          <input
            type="date"
            className="w-full bg-slate-700 text-white rounded px-2 py-1 text-sm"
            onChange={(e) => onToggle(filter, e.target.value)}
          />
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <span className="text-sm text-slate-300">{filter.label}</span>
          <input
            type="text"
            placeholder={`Enter ${filter.label.toLowerCase()}...`}
            className="w-full bg-slate-700 text-white rounded px-2 py-1 text-sm"
            onChange={(e) => onToggle(filter, e.target.value)}
          />
        </div>
      );
  }
}

// Filter chip component for inline display
function FilterChip({
  filter,
  active,
  onClick
}: {
  filter: FilterOption;
  active: boolean;
  onClick: (value: any) => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(!active)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center space-x-1 ${
        active
          ? 'bg-blue-500 text-white'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {filter.type === 'boolean' ? (
        active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />
      ) : filter.type === 'number' ? (
        <Hash className="w-3 h-3" />
      ) : filter.type === 'date' ? (
        <Calendar className="w-3 h-3" />
      ) : (
        <Filter className="w-3 h-3" />
      )}
      <span>{filter.label}</span>
    </motion.button>
  );
}