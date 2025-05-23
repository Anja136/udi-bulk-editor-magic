
import React from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import TableContent from './TableContent';

interface ScrollableColumnsProps {
  columns: UDITableColumn[];
  records: UDIRecord[];
  editingCell: { rowId: string; column: string } | null;
  editValue: string;
  onStartEditing: (record: UDIRecord, column: string) => void;
  onEditValueChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isColumnFiltered: (column: string) => boolean;
  onApplyFilter: (column: string, value: string) => void;
  onClearFilter: (column: string) => void;
  activeFilters?: { column: string; value: string }[];
  viewMode?: boolean;
}

const ScrollableColumns: React.FC<ScrollableColumnsProps> = ({
  columns,
  records,
  editingCell,
  editValue,
  onStartEditing,
  onEditValueChange,
  onSave,
  onCancel,
  isColumnFiltered,
  onApplyFilter,
  onClearFilter,
  activeFilters,
  viewMode = false
}) => {
  return (
    <div className="flex-1 overflow-visible">
      <TableContent
        columns={columns}
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
  );
};

export default ScrollableColumns;
