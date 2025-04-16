
import React from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import RowActions from './RowActions';
import TableContent from './TableContent';
import ColumnFilter from './ColumnFilter';

interface FrozenColumnsProps {
  columns: UDITableColumn[];
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

const FrozenColumns: React.FC<FrozenColumnsProps> = ({
  columns,
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
  const renderColumnHeader = (column: UDITableColumn) => (
    <div className="flex items-center justify-between">
      <div>
        {column.label}
        {column.required && <span className="text-error"> *</span>}
      </div>
      <ColumnFilter
        column={column.key as keyof UDIRecord}
        records={records}
        onApplyFilter={onApplyFilter}
        onClearFilter={onClearFilter}
        isFiltered={isColumnFiltered(column.key as keyof UDIRecord)}
        currentValue={activeFilters?.find(f => f.column === column.key)?.value}
      />
    </div>
  );

  const renderRowActions = (record: UDIRecord) => (
    <RowActions 
      isLocked={record.isLocked}
      onToggleLock={() => onToggleLock(record.id)}
    />
  );

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
      className="sticky left-0 z-10 bg-background shadow-sm"
      renderHeader={renderColumnHeader}
      renderActions={renderRowActions}
    />
  );
};

export default FrozenColumns;
