
import { useState, useEffect } from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { validateRecord } from '@/lib/validators';
import { FilterOption, createColumnFilter } from '@/lib/filterUtils';
import ColumnFilter from './UDITable/ColumnFilter';
import ActiveFilters from './UDITable/ActiveFilters';
import EditableCell from './UDITable/EditableCell';
import RowActions from './UDITable/RowActions';

interface UDIDataTableProps {
  data: UDIRecord[];
  onDataChange: (data: UDIRecord[]) => void;
  onFilterChange?: (filters: FilterOption[]) => void;
  activeFilters?: FilterOption[];
}

const UDIDataTable = ({ 
  data, 
  onDataChange, 
  onFilterChange,
  activeFilters = []
}: UDIDataTableProps) => {
  const [records, setRecords] = useState<UDIRecord[]>([]);
  const [editingCell, setEditingCell] = useState<{ rowId: string; column: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  
  useEffect(() => {
    setRecords(data);
  }, [data]);

  const columns: UDITableColumn[] = [
    { key: 'deviceIdentifier', label: 'Device Identifier', editable: true, required: true },
    { key: 'manufacturerName', label: 'Manufacturer', editable: true, required: true },
    { key: 'productName', label: 'Product', editable: true, required: true },
    { key: 'modelNumber', label: 'Model #', editable: true, required: false },
    { key: 'productionDate', label: 'Production Date', editable: true, required: false },
    { key: 'expirationDate', label: 'Expiration Date', editable: true, required: false },
    { key: 'lotNumber', label: 'Lot #', editable: true, required: false },
    { key: 'serialNumber', label: 'Serial #', editable: true, required: false },
    { key: 'status', label: 'Status', editable: false, required: false },
  ];

  const startEditing = (record: UDIRecord, column: string) => {
    if (record.isLocked) return;
    
    setEditingCell({ rowId: record.id, column });
    setEditValue(record[column as keyof UDIRecord]?.toString() || '');
  };

  const handleSave = () => {
    if (!editingCell) return;
    
    const { rowId, column } = editingCell;
    const updatedRecords = records.map(record => {
      if (record.id === rowId) {
        const updatedRecord = {
          ...record,
          [column]: editValue
        };
        return validateRecord(updatedRecord);
      }
      return record;
    });
    
    setRecords(updatedRecords);
    onDataChange(updatedRecords);
    setEditingCell(null);
  };

  const cancelEditing = () => {
    setEditingCell(null);
  };

  const toggleLock = (id: string) => {
    const updatedRecords = records.map(record => {
      if (record.id === id) {
        return { ...record, isLocked: !record.isLocked };
      }
      return record;
    });
    
    setRecords(updatedRecords);
    onDataChange(updatedRecords);
  };

  // Column filtering functions
  const isColumnFiltered = (column: keyof UDIRecord) => {
    return activeFilters?.some(filter => filter.column === column);
  };

  const applyFilter = (column: keyof UDIRecord, value: string) => {
    // Remove any existing filters for this column
    const otherFilters = activeFilters?.filter(f => f.column !== column) || [];
    
    // Create a new filter
    const newFilter = createColumnFilter(column, value);
    
    // Apply the new filter along with other existing filters
    onFilterChange?.([...otherFilters, newFilter]);
  };

  const clearColumnFilter = (column: keyof UDIRecord) => {
    const updatedFilters = activeFilters?.filter(f => f.column !== column) || [];
    onFilterChange?.(updatedFilters);
  };

  const handleBulkUpdate = (updatedRecords: UDIRecord[]) => {
    // This will be called when bulk edit is applied
    setRecords(updatedRecords);
    onDataChange(updatedRecords);
  };

  return (
    <div className="w-full overflow-auto">
      <ActiveFilters 
        activeFilters={activeFilters}
        columns={columns}
        filteredRecords={records}
        onClearColumnFilter={clearColumnFilter}
        onClearAllFilters={() => onFilterChange?.([])}
        onDataChange={handleBulkUpdate}
      />
      
      <Table className="min-w-full">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-12 text-center">Actions</TableHead>
            {columns.map((column) => (
              <TableHead key={column.key} className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    {column.label}
                    {column.required && <span className="text-error"> *</span>}
                  </div>
                  <ColumnFilter
                    column={column.key as keyof UDIRecord}
                    records={records}
                    onApplyFilter={applyFilter}
                    onClearFilter={clearColumnFilter}
                    isFiltered={isColumnFiltered(column.key as keyof UDIRecord)}
                    currentValue={activeFilters?.find(f => f.column === column.key)?.value}
                  />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center py-8">
                No data available. Upload a file or load demo data to get started.
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id} className={record.status === 'invalid' ? 'bg-error/5' : record.status === 'warning' ? 'bg-warning/5' : ''}>
                <TableCell className="text-center">
                  <RowActions 
                    isLocked={record.isLocked}
                    onToggleLock={() => toggleLock(record.id)}
                  />
                </TableCell>
                
                {columns.map((column) => (
                  <TableCell key={`${record.id}-${column.key}`} className="relative">
                    <EditableCell
                      record={record}
                      column={column.key}
                      isEditing={editingCell?.rowId === record.id && editingCell?.column === column.key}
                      editValue={editValue}
                      onStartEditing={() => startEditing(record, column.key)}
                      onEditValueChange={setEditValue}
                      onSave={handleSave}
                      onCancel={cancelEditing}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UDIDataTable;
