
import React from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import FrozenColumns from './FrozenColumns';
import ScrollableColumns from './ScrollableColumns';
import { ScrollArea } from "@/components/ui/scroll-area";

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
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="h-[calc(100vh-320px)] overflow-auto">
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
      </div>
    </div>
  );
};

export default DataTableContent;
