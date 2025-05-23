
import React from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import FrozenColumns from '../FrozenColumns';
import ScrollableColumns from '../ScrollableColumns';
import { ScrollArea } from "@/components/ui/scroll-area";

interface TableContainerProps {
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
  isColumnFiltered: (column: string) => boolean;
  onApplyFilter: (column: string, value: string) => void;
  onClearFilter: (column: string) => void;
  activeFilters?: { column: string; value: string }[];
  viewMode?: boolean;
}

const TableContainer: React.FC<TableContainerProps> = ({
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
  activeFilters,
  viewMode = false
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="h-[calc(100vh-400px)] relative">
        <ScrollArea orientation="both" className="h-full">
          <div className="flex flex-row w-full min-w-max">
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
              viewMode={viewMode}
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
              viewMode={viewMode}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TableContainer;
