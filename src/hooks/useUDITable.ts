
import { useState, useEffect } from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import { FilterOption } from '@/lib/filterUtils';
import { validateRecord } from '@/lib/validators';

interface UseUDITableProps {
  data: UDIRecord[];
  onDataChange: (data: UDIRecord[]) => void;
  activeFilters?: FilterOption[];
  viewMode?: boolean;
}

export const useUDITable = ({ data, onDataChange, activeFilters = [], viewMode = false }: UseUDITableProps) => {
  const [records, setRecords] = useState<UDIRecord[]>([]);
  const [editingCell, setEditingCell] = useState<{ rowId: string; column: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [activeSheet, setActiveSheet] = useState<string>('basic');

  useEffect(() => {
    // This ensures records state is always in sync with the filtered data
    setRecords(data);
  }, [data]);

  const columns: UDITableColumn[] = [
    { key: 'deviceIdentifier', label: 'Device Identifier', editable: !viewMode, required: true, frozen: true, width: '200px' },
    { key: 'manufacturerName', label: 'Manufacturer', editable: !viewMode, required: true, frozen: true, width: '180px' },
    { key: 'productName', label: 'Product', editable: !viewMode, required: true, width: '180px' },
    { key: 'modelNumber', label: 'Model #', editable: !viewMode, required: false, width: '120px' },
    { key: 'singleUse', label: 'Single Use', editable: !viewMode, required: false, type: 'boolean', width: '100px' },
    { key: 'sterilized', label: 'Sterilized', editable: !viewMode, required: false, type: 'boolean', width: '100px' },
    { key: 'containsLatex', label: 'Contains Latex', editable: !viewMode, required: false, type: 'boolean', width: '120px' },
    { key: 'containsPhthalate', label: 'Contains Phthalate', editable: !viewMode, required: false, type: 'boolean', width: '150px' },
    { key: 'productionDate', label: 'Production Date', editable: !viewMode, required: false, type: 'date', width: '150px' },
    { key: 'expirationDate', label: 'Expiration Date', editable: !viewMode, required: false, type: 'date', width: '150px' },
    { key: 'lotNumber', label: 'Lot #', editable: !viewMode, required: false, width: '120px' },
    { key: 'serialNumber', label: 'Serial #', editable: !viewMode, required: false, width: '120px' },
    { key: 'status', label: 'Status', editable: false, required: false, width: '100px' },
  ];

  // Get frozen and non-frozen columns
  const frozenColumns = columns.filter(col => col.frozen);
  const scrollableColumns = columns.filter(col => !col.frozen);

  const startEditing = (record: UDIRecord, column: string) => {
    if (record.isLocked || viewMode) return;
    
    setEditingCell({ rowId: record.id, column });
    
    // Format the value based on type
    if (['singleUse', 'sterilized', 'containsLatex', 'containsPhthalate'].includes(column)) {
      // For boolean fields, use "true" or "false" string
      setEditValue(String(record[column]));
    } else {
      // For all other fields
      setEditValue(record[column]?.toString() || '');
    }
  };

  const handleSave = () => {
    if (!editingCell || viewMode) return;
    
    const { rowId, column } = editingCell;
    const updatedRecords = records.map(record => {
      if (record.id === rowId) {
        const updatedRecord = { ...record };
        
        // Apply the value based on type
        if (['singleUse', 'sterilized', 'containsLatex', 'containsPhthalate'].includes(column)) {
          // For boolean fields, convert "true"/"false" strings to boolean values
          updatedRecord[column] = editValue === "true";
        } else if (['productionDate', 'expirationDate'].includes(column)) {
          // For date fields
          updatedRecord[column] = editValue;
        } else {
          // For all other fields
          updatedRecord[column] = editValue;
        }
        
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
    if (viewMode) return;
    
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
  const isColumnFiltered = (column: string) => {
    return activeFilters?.some(filter => filter.column === column) || false;
  };

  return {
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
    cancelEditing: () => setEditingCell(null),
    toggleLock,
    isColumnFiltered,
  };
};
