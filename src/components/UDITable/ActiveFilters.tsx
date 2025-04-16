
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { UDITableColumn } from '@/types/udi';
import { FilterOption } from '@/lib/filterUtils';

interface ActiveFiltersProps {
  activeFilters: FilterOption[];
  columns: UDITableColumn[];
  onClearColumnFilter: (column: string) => void;
  onClearAllFilters: () => void;
}

const ActiveFilters = ({
  activeFilters,
  columns,
  onClearColumnFilter,
  onClearAllFilters
}: ActiveFiltersProps) => {
  if (activeFilters.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-3 p-2 bg-muted/30 rounded-md">
      <span className="text-sm font-medium px-2 py-1">Active filters:</span>
      {activeFilters.map((filter, idx) => {
        const columnDef = columns.find(c => c.key === filter.column);
        return (
          <Badge 
            key={idx} 
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {columnDef?.label || filter.column}: {filter.value}
            <Button 
              variant="ghost" 
              size="icon"
              className="h-4 w-4 ml-1 p-0"
              onClick={() => onClearColumnFilter(filter.column)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        );
      })}
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs"
        onClick={onClearAllFilters}
      >
        Clear all
      </Button>
    </div>
  );
};

export default ActiveFilters;
