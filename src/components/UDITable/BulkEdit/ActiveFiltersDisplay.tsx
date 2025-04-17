
import React from 'react';
import { FilterOption } from '@/lib/filterUtils';
import { UDITableColumn } from '@/types/udi';

interface ActiveFiltersDisplayProps {
  activeFilters: FilterOption[];
  columns: UDITableColumn[];
}

const ActiveFiltersDisplay = ({ activeFilters, columns }: ActiveFiltersDisplayProps) => {
  if (activeFilters.length === 0) return null;
  
  return (
    <div className="mt-2 text-xs p-2 bg-muted rounded-sm">
      <span className="font-semibold">Active filters: </span>
      {activeFilters.map((filter, idx) => (
        <span key={idx}>
          {columns.find(c => c.key.toString() === filter.column)?.label || filter.column}: {filter.value}
          {idx < activeFilters.length - 1 ? ', ' : ''}
        </span>
      ))}
    </div>
  );
};

export default ActiveFiltersDisplay;
