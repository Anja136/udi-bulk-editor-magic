
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Save, AlertCircle, X, AlertTriangle } from 'lucide-react';
import { UDIRecord } from '@/types/udi';
import StatusBadge from './StatusBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface EditableCellProps {
  record: UDIRecord;
  column: string;
  isEditing: boolean;
  editValue: string;
  onStartEditing: () => void;
  onEditValueChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditableCell = ({
  record,
  column,
  isEditing,
  editValue,
  onStartEditing,
  onEditValueChange,
  onSave,
  onCancel
}: EditableCellProps) => {
  if (isEditing) {
    // Special handling for boolean values when editing
    if (['singleUse', 'sterilized', 'containsLatex', 'containsPhthalate'].includes(column)) {
      return (
        <div className="flex items-center space-x-2 h-full">
          <select
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            className="h-8 w-full border rounded-md px-2"
            autoFocus
          >
            <option value="true">YES</option>
            <option value="false">NO</option>
          </select>
          <Button variant="ghost" size="icon" onClick={onSave} title="Save">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onCancel} title="Cancel">
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    
    // Special handling for date values
    if (['productionDate', 'expirationDate'].includes(column)) {
      return (
        <div className="flex items-center space-x-1 h-full">
          <Input
            type="date"
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            className="h-8 w-full"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave();
              if (e.key === 'Escape') onCancel();
            }}
          />
          <Button variant="ghost" size="icon" onClick={onSave} title="Save">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onCancel} title="Cancel">
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    // Regular editing for non-boolean values
    return (
      <div className="flex items-center space-x-1 h-full">
        <Input
          value={editValue}
          onChange={(e) => onEditValueChange(e.target.value)}
          className="h-8 w-full"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
        />
        <Button variant="ghost" size="icon" onClick={onSave} title="Save">
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onCancel} title="Cancel">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (column === 'status') {
    return <StatusBadge record={record} />;
  }

  // Handle boolean type fields - display YES or NO instead of switch
  if (['singleUse', 'sterilized', 'containsLatex', 'containsPhthalate'].includes(column)) {
    const isChecked = Boolean(record[column as keyof UDIRecord]);
    const isEditable = !record.isLocked;
    
    return (
      <div 
        className={`flex items-center justify-center h-full ${isEditable ? 'cursor-pointer hover:bg-secondary/50 p-1 rounded transition-colors' : ''}`}
        onClick={isEditable ? onStartEditing : undefined}
      >
        <span className={`font-medium ${isChecked ? 'text-green-600' : 'text-red-600'}`}>
          {isChecked ? 'YES' : 'NO'}
        </span>
      </div>
    );
  }

  // Handle date fields
  if (['productionDate', 'expirationDate'].includes(column)) {
    const dateValue = record[column as keyof UDIRecord] as string;
    const isEditable = !record.isLocked;
    
    // Format date for display if needed
    const displayDate = dateValue || '';
    
    return (
      <div
        className={`flex items-center h-full ${isEditable ? 'cursor-pointer hover:bg-secondary/50 p-1 rounded transition-colors' : ''}`}
        onClick={isEditable ? onStartEditing : undefined}
      >
        <div className="flex items-center w-full">
          <span className="truncate">{displayDate}</span>
          {isEditable && (
            <Edit className="h-3 w-3 ml-1 text-muted-foreground opacity-50" />
          )}
        </div>
      </div>
    );
  }

  const isEditable = column !== 'status' && !record.isLocked;
  const cellValue = String(record[column as keyof UDIRecord] || '');
  
  // Check if this specific field has errors
  const fieldErrors = getFieldErrors(record, column);
  const hasError = fieldErrors.errorMessages.length > 0;
  const hasWarning = fieldErrors.warningMessages.length > 0;

  // If there's an error or warning for this specific cell, show it with a popover
  if (hasError || hasWarning) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={`flex items-center h-full ${isEditable ? 'cursor-pointer hover:bg-secondary/50 p-1 rounded transition-colors' : ''}`}
            onClick={isEditable ? onStartEditing : undefined}
          >
            <div className="flex items-center justify-between w-full pl-1">
              <span className={`${hasError ? 'text-error' : 'text-warning'} mr-1`}>
                {cellValue}
              </span>
              <div className="flex-shrink-0 ml-auto">
                {hasError ? (
                  <AlertCircle className="h-4 w-4 text-error" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent side="right" align="start" className={`max-w-xs ${hasError ? "bg-error/10 border-error" : "bg-warning/10 border-warning"}`}>
          <div className="max-w-xs">
            <div className="text-sm font-medium mb-1">{hasError ? 'Error:' : 'Warning:'}</div>
            {fieldErrors.errorMessages.map((message, idx) => (
              <div key={idx} className="text-xs flex items-start gap-1 mb-1">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-error" />
                <span>{message}</span>
              </div>
            ))}
            {fieldErrors.warningMessages.map((message, idx) => (
              <div key={idx} className="text-xs flex items-start gap-1">
                <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0 text-warning" />
                <span>{message}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Regular cell with no errors
  return (
    <div
      className={`flex items-center h-full ${isEditable ? 'cursor-pointer hover:bg-secondary/50 p-1 rounded transition-colors' : ''}`}
      onClick={isEditable ? onStartEditing : undefined}
    >
      <div className="flex items-center w-full">
        <span className="truncate">{cellValue}</span>
        {isEditable && (
          <Edit className="h-3 w-3 ml-1 text-muted-foreground opacity-50" />
        )}
      </div>
    </div>
  );
};

// Helper function to get field-specific errors and warnings
function getFieldErrors(record: UDIRecord, column: string) {
  const errorMessages: string[] = [];
  const warningMessages: string[] = [];
  
  // Define field-specific error message keywords
  const errorKeywords: Record<string, string[]> = {
    deviceIdentifier: ['device identifier', 'deviceidentifier'],
    manufacturerName: ['manufacturer', 'manufacturername'],
    productName: ['product', 'productname'],
    modelNumber: ['model', 'modelnumber'],
    singleUse: ['single use', 'singleuse'],
    sterilized: ['sterilized'],
    containsLatex: ['latex', 'containslatex'],
    containsPhthalate: ['phthalate', 'containsphthalate'],
    productionDate: ['production date', 'productiondate'],
    expirationDate: ['expiration date', 'expirationdate'],
    lotNumber: ['lot', 'lotnumber'],
    serialNumber: ['serial', 'serialnumber']
  };
  
  // Check for required fields
  if (['deviceIdentifier', 'manufacturerName', 'productName'].includes(column) && !record[column as keyof UDIRecord]) {
    errorMessages.push('This field is mandatory');
  }
  
  // Check for specific field errors
  if (record.errors) {
    const fieldKeywords = errorKeywords[column] || [column.toLowerCase()];
    
    record.errors.forEach(error => {
      const lowerError = error.toLowerCase();
      if (fieldKeywords.some(keyword => lowerError.includes(keyword))) {
        errorMessages.push(error);
      }
    });
  }
  
  // Check for specific field warnings
  if (record.warnings) {
    const fieldKeywords = errorKeywords[column] || [column.toLowerCase()];
    
    record.warnings.forEach(warning => {
      const lowerWarning = warning.toLowerCase();
      if (fieldKeywords.some(keyword => lowerWarning.includes(keyword))) {
        warningMessages.push(warning);
      }
    });
  }
  
  return { errorMessages, warningMessages };
}

export default EditableCell;
