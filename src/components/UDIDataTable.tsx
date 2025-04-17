
import React from 'react';
import { UDIRecord, DataSheet } from '@/types/udi';
import { FilterOption, createColumnFilter } from '@/lib/filterUtils';
import ActiveFilters from './UDITable/ActiveFilters';
import SheetTabs from './UDITable/SheetTabs';
import { useUDITable } from '@/hooks/useUDITable';
import { FileText } from 'lucide-react';
import BulkEditDialog from './UDITable/BulkEditDialog';

interface UDIDataTableProps {
  data: UDIRecord[];
  onDataChange: (data: UDIRecord[]) => void;
  onFilterChange?: (filters: FilterOption[]) => void;
  activeFilters?: FilterOption[];
  viewMode?: boolean;
}

const UDIDataTable = ({ 
  data, 
  onDataChange, 
  onFilterChange,
  activeFilters = [],
  viewMode = false
}: UDIDataTableProps) => {
  // Use the custom hook for table state and logic
  const {
    records,
    columns,
    frozenColumns,
    scrollableColumns,
    editingCell,
    editValue,
    activeSheet,
    setActiveSheet,
    startEditing,
    setEditValue,
    handleSave,
    cancelEditing,
    toggleLock,
    isColumnFiltered,
  } = useUDITable({ data, onDataChange, activeFilters, viewMode });
  
  const sheets: DataSheet[] = [
    { id: 'basic', name: 'Basic Information', type: 'basic', icon: <FileText className="h-4 w-4" /> },
  ];

  // Column filtering functions
  const applyFilter = (column: string, value: string) => {
    // Remove any existing filters for this column
    const otherFilters = activeFilters?.filter(f => f.column !== column) || [];
    
    // Create a new filter
    const newFilter = createColumnFilter(column, value);
    
    // Apply the new filter along with other existing filters
    onFilterChange?.([...otherFilters, newFilter]);
  };

  const clearColumnFilter = (column: string) => {
    const updatedFilters = activeFilters?.filter(f => f.column !== column) || [];
    onFilterChange?.(updatedFilters);
  };

  const handleBulkUpdate = (updatedRecords: UDIRecord[]) => {
    // This will be called when bulk edit is applied
    onDataChange(updatedRecords);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between mb-3">
        {activeFilters && activeFilters.length > 0 ? (
          <ActiveFilters 
            activeFilters={activeFilters}
            columns={columns}
            filteredRecords={records}
            onClearColumnFilter={clearColumnFilter}
            onClearAllFilters={() => onFilterChange?.([])}
            onDataChange={handleBulkUpdate}
          />
        ) : (
          <div></div>
        )}
        {!viewMode && (
          <BulkEditDialog 
            filteredRecords={records}
            columns={columns}
            activeFilters={activeFilters || []}
            onRecordsUpdate={handleBulkUpdate}
          />
        )}
      </div>
      
      <SheetTabs
        activeSheet={activeSheet}
        setActiveSheet={setActiveSheet}
        sheets={sheets}
        records={records}
        columns={columns}
        frozenColumns={frozenColumns}
        scrollableColumns={scrollableColumns}
        editingCell={editingCell}
        editValue={editValue}
        onStartEditing={startEditing}
        onEditValueChange={setEditValue}
        onSave={handleSave}
        onCancel={cancelEditing}
        onToggleLock={toggleLock}
        isColumnFiltered={isColumnFiltered}
        onApplyFilter={applyFilter}
        onClearFilter={clearColumnFilter}
        activeFilters={activeFilters}
        viewMode={viewMode}
      />
    </div>
  );
};

export default UDIDataTable;
