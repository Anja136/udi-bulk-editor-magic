
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UDITableColumn } from '@/types/udi';

interface FieldSelectorProps {
  columns: UDITableColumn[];
  selectedField: string;
  onFieldChange: (field: string) => void;
}

const FieldSelector = ({ columns, selectedField, onFieldChange }: FieldSelectorProps) => {
  // Only show editable columns
  const editableColumns = columns.filter(col => col.editable);
  
  return (
    <Select 
      value={selectedField} 
      onValueChange={onFieldChange}
    >
      <SelectTrigger className="col-span-3">
        <SelectValue placeholder="Select a field" />
      </SelectTrigger>
      <SelectContent>
        {editableColumns.map((column) => (
          <SelectItem key={column.key.toString()} value={column.key.toString()}>
            {column.label} {column.required && <span className="text-destructive">*</span>}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FieldSelector;
