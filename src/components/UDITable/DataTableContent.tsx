
import React from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import DataAlerts from './DataAlerts/DataAlerts';
import TableContainer from './TableContainer/TableContainer';

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
  isColumnFiltered: (column: string) => boolean;
  onApplyFilter: (column: string, value: string) => void;
  onClearFilter: (column: string) => void;
  activeFilters?: { column: string; value: string }[];
  viewMode?: boolean;
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
  activeFilters,
  viewMode = false
}) => {
  return (
    <div className="space-y-4">
      <DataAlerts records={records} />
      
      <TableContainer
        frozenColumns={frozenColumns}
        scrollableColumns={scrollableColumns}
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
    </div>
  );
};

export default DataTableContent;
