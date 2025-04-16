
import React from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import EditableCell from './EditableCell';
import ColumnFilter from './ColumnFilter';

interface TableContentProps {
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
  className?: string;
  renderHeader?: (column: UDITableColumn) => React.ReactNode;
  renderActions?: (record: UDIRecord) => React.ReactNode;
}

const TableContent: React.FC<TableContentProps> = ({
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
  className,
  renderHeader,
  renderActions
}) => {
  // Helper function to determine if a cell has errors or warnings
  const getCellErrorStatus = (record: UDIRecord, column: string) => {
    if (record.status === 'invalid' && record.errors) {
      return record.errors.some(err => err.toLowerCase().includes(column.toLowerCase()))
        ? 'error'
        : null;
    }
    if (record.status === 'warning' && record.warnings) {
      return record.warnings.some(warn => warn.toLowerCase().includes(column.toLowerCase()))
        ? 'warning'
        : null;
    }
    return null;
  };

  return (
    <div className={className}>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            {renderActions && (
              <TableHead className="w-12 text-center sticky left-0 z-20 bg-muted/50 h-12">Actions</TableHead>
            )}
            
            {columns.map((column) => (
              <TableHead 
                key={column.key} 
                style={{ width: column.width, minWidth: column.width }}
                className={column.frozen ? "sticky left-0 z-20 bg-muted/50 h-12" : "h-12"}
              >
                {renderHeader ? renderHeader(column) : (
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
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-8">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={`table-row-${record.id}`} className="bg-background">
                {renderActions && (
                  <TableCell className="text-center sticky left-0 z-20 bg-background h-12 py-0">
                    {renderActions(record)}
                  </TableCell>
                )}
                
                {columns.map((column) => {
                  const errorStatus = getCellErrorStatus(record, column.key);
                  
                  return (
                    <TableCell 
                      key={`${record.id}-${column.key}`}
                      style={{ width: column.width, minWidth: column.width }}
                      className={`${column.frozen ? "sticky left-0 z-20 bg-background" : ""} 
                                 ${errorStatus === 'error' ? 'bg-error/5' : errorStatus === 'warning' ? 'bg-warning/5' : ''} 
                                 h-12 py-0`}
                    >
                      <EditableCell
                        record={record}
                        column={column.key}
                        isEditing={editingCell?.rowId === record.id && editingCell?.column === column.key}
                        editValue={editValue}
                        onStartEditing={() => onStartEditing(record, column.key)}
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

export default TableContent;
