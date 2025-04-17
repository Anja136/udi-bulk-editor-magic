
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
  isColumnFiltered: (column: string) => boolean;
  onApplyFilter: (column: string, value: string) => void;
  onClearFilter: (column: string) => void;
  activeFilters?: { column: string; value: string }[];
  className?: string;
  renderHeader?: (column: UDITableColumn) => React.ReactNode;
  renderActions?: (record: UDIRecord) => React.ReactNode;
  viewMode?: boolean;
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
  renderActions,
  viewMode = false
}) => {
  return (
    <div className={`${className} w-full`}>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            {renderActions && (
              <TableHead className="w-12 text-center sticky left-0 z-20 bg-muted/50 h-12">Actions</TableHead>
            )}
            
            {columns.map((column) => (
              <TableHead 
                key={column.key.toString()} 
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
                      column={column.key.toString()}
                      records={records}
                      onApplyFilter={onApplyFilter}
                      onClearFilter={onClearFilter}
                      isFiltered={isColumnFiltered(column.key.toString())}
                      currentValue={activeFilters?.find(f => f.column === column.key.toString())?.value}
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
              <TableRow key={`table-row-${record.id}`} className={`bg-background ${record.status === 'invalid' ? 'bg-error/5' : record.status === 'warning' ? 'bg-warning/5' : ''}`}>
                {renderActions && (
                  <TableCell className="text-center sticky left-0 z-20 bg-background h-12 py-0">
                    {renderActions(record)}
                  </TableCell>
                )}
                
                {columns.map((column) => {
                  const columnKey = column.key.toString();
                  
                  return (
                    <TableCell 
                      key={`${record.id}-${columnKey}`}
                      style={{ width: column.width, minWidth: column.width }}
                      className={`${column.frozen ? "sticky left-0 z-20 bg-background" : ""} h-12 py-0`}
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

export default TableContent;
