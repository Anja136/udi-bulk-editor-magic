
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Save, AlertCircle, Check, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { UDIRecord } from '@/types/udi';
import StatusBadge from './StatusBadge';

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
    return (
      <div className="flex items-center space-x-1">
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
          <AlertCircle className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (column === 'status') {
    return <StatusBadge record={record} />;
  }

  // Handle boolean type fields
  if (['singleUse', 'sterilized', 'containsLatex', 'containsPhthalate'].includes(column)) {
    const isChecked = Boolean(record[column as keyof UDIRecord]);
    const isEditable = !record.isLocked;
    
    return (
      <div className="flex items-center justify-center">
        {isEditable ? (
          <Switch 
            checked={isChecked} 
            onCheckedChange={(checked) => {
              onEditValueChange(String(checked));
              setTimeout(onSave, 0);
            }}
            disabled={!isEditable}
          />
        ) : (
          <>
            {isChecked ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />}
          </>
        )}
      </div>
    );
  }

  const isEditable = column !== 'status' && !record.isLocked;
  const cellValue = String(record[column as keyof UDIRecord] || '');

  return (
    <div
      className={`flex items-center ${isEditable ? 'cursor-pointer hover:bg-secondary/50 p-1 rounded transition-colors' : ''}`}
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
