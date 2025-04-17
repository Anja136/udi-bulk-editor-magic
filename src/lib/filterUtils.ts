
import { UDIRecord } from '@/types/udi';

export interface FilterOption {
  column: string; // Changed from keyof UDIRecord to string for compatibility
  value: string;
  operation: 'contains' | 'equals' | 'startsWith' | 'endsWith';
}

export const filterRecords = (records: UDIRecord[], filters: FilterOption[]): UDIRecord[] => {
  if (!filters || filters.length === 0) return records;
  
  return records.filter(record => {
    return filters.every(filter => {
      // Special handling for isLocked filter (Actions column)
      if (filter.column === 'isLocked') {
        const isLocked = record.isLocked;
        const filterValue = filter.value === 'true';
        return isLocked === filterValue;
      }
      
      const fieldValue = String(record[filter.column] || '').toLowerCase();
      const filterValue = filter.value.toLowerCase();
      
      switch (filter.operation) {
        case 'contains':
          return fieldValue.includes(filterValue);
        case 'equals':
          return fieldValue === filterValue;
        case 'startsWith':
          return fieldValue.startsWith(filterValue);
        case 'endsWith':
          return fieldValue.endsWith(filterValue);
        default:
          return true;
      }
    });
  });
};

// Get unique values for a specific column in the records
export const getUniqueColumnValues = (records: UDIRecord[], column: string): string[] => {
  const valueSet = new Set<string>();
  
  records.forEach(record => {
    const value = String(record[column] || '');
    if (value.trim()) {
      valueSet.add(value);
    }
  });
  
  return Array.from(valueSet).sort();
};

// Apply a quick filter for a specific column and value
export const createColumnFilter = (column: string, value: string): FilterOption => {
  return {
    column,
    value,
    operation: 'equals'
  };
};
