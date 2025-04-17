
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BulkEditFieldProps {
  selectedField: string;
  newValue: string;
  onValueChange: (value: string) => void;
  isBooleanField: boolean;
  isDateField: boolean;
  isMultilineField: boolean;
}

const BulkEditField = ({
  selectedField,
  newValue,
  onValueChange,
  isBooleanField,
  isDateField,
  isMultilineField
}: BulkEditFieldProps) => {
  if (isBooleanField) {
    return (
      <Select
        value={newValue}
        onValueChange={onValueChange}
        disabled={!selectedField}
      >
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Select value" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="YES">YES</SelectItem>
          <SelectItem value="NO">NO</SelectItem>
        </SelectContent>
      </Select>
    );
  }
  
  if (isDateField) {
    return (
      <Input
        value={newValue}
        onChange={(e) => onValueChange(e.target.value)}
        className="col-span-3"
        disabled={!selectedField}
        type="date"
        placeholder="YYYY-MM-DD"
      />
    );
  }
  
  if (isMultilineField) {
    return (
      <Textarea
        value={newValue}
        onChange={(e) => onValueChange(e.target.value)}
        className="col-span-3 min-h-[80px]"
        disabled={!selectedField}
        placeholder="Enter value..."
      />
    );
  }
  
  return (
    <Input
      value={newValue}
      onChange={(e) => onValueChange(e.target.value)}
      className="col-span-3"
      disabled={!selectedField}
      placeholder="Enter value..."
    />
  );
};

export default BulkEditField;
