
import { UDIRecord } from '@/types/udi';

export interface FilterOption {
  column: keyof UDIRecord;
  value: string;
  operation: 'contains' | 'equals' | 'startsWith' | 'endsWith';
}

export const filterRecords = (records: UDIRecord[], filters: FilterOption[]): UDIRecord[] => {
  if (filters.length === 0) return records;
  
  return records.filter(record => {
    return filters.every(filter => {
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
