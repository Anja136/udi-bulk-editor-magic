
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Save, AlertCircle, Check, X } from 'lucide-react';
import { UDIRecord } from '@/types/udi';
import StatusBadge from './StatusBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  const isEditable = column !== 'status' && !record.isLocked;
  const cellValue = String(record[column as keyof UDIRecord] || '');
  
  // Check if this field has errors
  const hasError = record.status === 'invalid' && 
    record.errors && 
    record.errors.some(err => err.toLowerCase().includes(column.toLowerCase()));
  
  // Check if this field has warnings
  const hasWarning = record.status === 'warning' && 
    record.warnings && 
    record.warnings.some(warn => warn.toLowerCase().includes(column.toLowerCase()));

  // If there's an error or warning for this cell, show it with a tooltip
  if (hasError || hasWarning) {
    const relevantMessages = hasError 
      ? record.errors?.filter(err => err.toLowerCase().includes(column.toLowerCase()))
      : record.warnings?.filter(warn => warn.toLowerCase().includes(column.toLowerCase()));
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`flex items-center h-full ${isEditable ? 'cursor-pointer hover:bg-secondary/50 p-1 rounded transition-colors' : ''} ${hasError ? 'border-l-4 border-error' : 'border-l-4 border-warning'}`}
              onClick={isEditable ? onStartEditing : undefined}
            >
              <div className="flex items-center w-full">
                <span className={`truncate ${hasError ? 'text-error font-medium' : 'text-warning font-medium'}`}>
                  {cellValue}
                </span>
                {hasError ? (
                  <AlertCircle className="h-4 w-4 ml-1 text-error" />
                ) : (
                  <AlertCircle className="h-4 w-4 ml-1 text-warning" />
                )}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs">
              {relevantMessages?.map((message, idx) => (
                <div key={idx} className="text-xs">{message}</div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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

export default EditableCell;
