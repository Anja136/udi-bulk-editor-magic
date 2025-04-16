
import React from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import FrozenColumns from './FrozenColumns';
import ScrollableColumns from './ScrollableColumns';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface DataTableContentProps {
  frozenColumns: UDITableColumn[];
  scrollableColumns: UDITableColumn[];
  records: UDIRecord[];
  editingCell: { rowId: string; column: string } | null;
  editValue: string;
  onStartEditing: (record: UDIRecord, column: string) => void;
  onEditValueChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onToggleLock: (id: string) => void;
  isColumnFiltered: (column: keyof UDIRecord) => boolean;
  onApplyFilter: (column: keyof UDIRecord, value: string) => void;
  onClearFilter: (column: keyof UDIRecord) => void;
  activeFilters?: { column: keyof UDIRecord; value: string }[];
}

const DataTableContent: React.FC<DataTableContentProps> = ({
  frozenColumns,
  scrollableColumns,
  records,
  editingCell,
  editValue,
  onStartEditing,
  onEditValueChange,
  onSave,
  onCancel,
  onToggleLock,
  isColumnFiltered,
  onApplyFilter,
  onClearFilter,
  activeFilters
}) => {
  // Count records with errors and warnings
  const invalidRecords = records.filter(r => r.status === 'invalid').length;
  const warningRecords = records.filter(r => r.status === 'warning').length;
  
  return (
    <div className="space-y-4">
      {(invalidRecords > 0 || warningRecords > 0) && (
        <Alert variant={invalidRecords > 0 ? "destructive" : "default"} className={invalidRecords > 0 ? "border-error" : "border-warning"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Issues Detected</AlertTitle>
          <AlertDescription>
            {invalidRecords > 0 && (
              <div className="text-error font-medium">
                {invalidRecords} record{invalidRecords !== 1 ? 's' : ''} with validation errors
              </div>
            )}
            {warningRecords > 0 && (
              <div className="text-warning font-medium">
                {warningRecords} record{warningRecords !== 1 ? 's' : ''} with warnings
              </div>
            )}
            <div className="text-xs mt-1 text-muted-foreground">
              Fields with issues are highlighted in the table. Hover over icons to see error details.
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="border rounded-md overflow-hidden">
        <div className="h-[calc(100vh-400px)] relative">
          <ScrollArea className="h-full" scrollHide={false}>
            <div className="flex flex-row w-full min-w-full">
              <FrozenColumns
                columns={frozenColumns}
                records={records}
                editingCell={editingCell}
                editValue={editValue}
                onStartEditing={onStartEditing}
                onEditValueChange={onEditValueChange}
                onSave={onSave}
                onCancel={onCancel}
                onToggleLock={onToggleLock}
                isColumnFiltered={isColumnFiltered}
                onApplyFilter={onApplyFilter}
                onClearFilter={onClearFilter}
                activeFilters={activeFilters}
              />
              
              <ScrollableColumns
                columns={scrollableColumns}
                records={records}
                editingCell={editingCell}
                editValue={editValue}
                onStartEditing={onStartEditing}
                onEditValueChange={onEditValueChange}
                onSave={onSave}
                onCancel={onCancel}
                isColumnFiltered={isColumnFiltered}
                onApplyFilter={onApplyFilter}
                onClearFilter={onClearFilter}
                activeFilters={activeFilters}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default DataTableContent;
