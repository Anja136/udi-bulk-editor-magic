
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
  isColumnFiltered: (column: keyof UDIRecord) => boolean;
  onApplyFilter: (column: keyof UDIRecord, value: string) => void;
  onClearFilter: (column: keyof UDIRecord) => void;
  activeFilters?: { column: keyof UDIRecord; value: string }[];
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
  activeFilters
}) => {
  return (
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
      className="overflow-x-auto"
    />
  );
};

export default ScrollableColumns;
