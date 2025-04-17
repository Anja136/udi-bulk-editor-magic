
import React from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import RowActions from './RowActions';
import TableContent from './TableContent';
import ColumnFilter from './ColumnFilter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  isColumnFiltered: (column: string) => boolean;
  onApplyFilter: (column: string, value: string) => void;
  onClearFilter: (column: string) => void;
  activeFilters?: { column: string; value: string }[];
  viewMode?: boolean;
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
  activeFilters,
  viewMode = false
}) => {
  const renderColumnHeader = (column: UDITableColumn) => (
    <div className="flex items-center justify-between">
      <div>
        {column.label}
        {column.required && <span className="text-error"> *</span>}
      </div>
      <ColumnFilter
        column={column.key.toString()}
        records={records}
        onApplyFilter={onApplyFilter}
        onClearFilter={onClearFilter}
        isFiltered={isColumnFiltered(column.key.toString())}
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
    <div className="sticky left-0 z-10 bg-background shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-12 text-center sticky left-0 z-20 bg-muted/50 h-12">
              <div className="flex items-center justify-between">
                Actions
                <ColumnFilter
                  column="actions"
                  records={records}
                  onApplyFilter={(column, value) => {
                    // Special handling for actions filter
                    const lockStatus = value === 'Locked' ? 'true' : 'false';
                    onApplyFilter('isLocked', lockStatus);
                  }}
                  onClearFilter={() => onClearFilter('isLocked')}
                  isFiltered={isColumnFiltered('isLocked')}
                  currentValue={activeFilters?.find(f => f.column === 'isLocked')?.value === 'true' ? 'Locked' : 
                              activeFilters?.find(f => f.column === 'isLocked')?.value === 'false' ? 'Unlocked' : undefined}
                />
              </div>
            </TableHead>
            
            {columns.map((column) => (
              <TableHead 
                key={column.key.toString()} 
                style={{ width: column.width, minWidth: column.width }}
                className="sticky left-0 z-20 bg-muted/50 h-12"
              >
                {renderColumnHeader(column)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center py-8">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={`frozen-row-${record.id}`} className={`bg-background ${record.status === 'invalid' ? 'bg-error/5' : record.status === 'warning' ? 'bg-warning/5' : ''}`}>
                <TableCell className="text-center sticky left-0 z-20 bg-background h-12 py-0">
                  {renderRowActions(record)}
                </TableCell>
                
                {columns.map((column) => {
                  const columnKey = column.key.toString();
                  
                  return (
                    <TableCell 
                      key={`${record.id}-${columnKey}`}
                      style={{ width: column.width, minWidth: column.width }}
                      className="sticky left-0 z-20 bg-background h-12 py-0"
                    >
                      <EditableCell
                        record={record}
                        column={columnKey}
                        isEditing={editingCell?.rowId === record.id && editingCell?.column === columnKey}
                        editValue={editValue}
                        onStartEditing={() => onStartEditing(record, columnKey)}
                        onEditValueChange={onEditValueChange}
                        onSave={onSave}
                        onCancel={onCancel}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FrozenColumns;
