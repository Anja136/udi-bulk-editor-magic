
import { useState, useEffect } from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import { FilterOption } from '@/lib/filterUtils';
import { validateRecord } from '@/lib/validators';

interface UseUDITableProps {
  data: UDIRecord[];
  onDataChange: (data: UDIRecord[]) => void;
  activeFilters?: FilterOption[];
}

export const useUDITable = ({ data, onDataChange, activeFilters = [] }: UseUDITableProps) => {
  const [records, setRecords] = useState<UDIRecord[]>([]);
  const [editingCell, setEditingCell] = useState<{ rowId: string; column: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [activeSheet, setActiveSheet] = useState<string>('basic');

  useEffect(() => {
    setRecords(data);
  }, [data]);

  const columns: UDITableColumn[] = [
    { key: 'deviceIdentifier', label: 'Device Identifier', editable: true, required: true, frozen: true, width: '200px' },
    { key: 'manufacturerName', label: 'Manufacturer', editable: true, required: true, frozen: true, width: '180px' },
    { key: 'productName', label: 'Product', editable: true, required: true, width: '180px' },
    { key: 'modelNumber', label: 'Model #', editable: true, required: false, width: '120px' },
    { key: 'singleUse', label: 'Single Use', editable: true, required: false, type: 'boolean', width: '100px' },
    { key: 'sterilized', label: 'Sterilized', editable: true, required: false, type: 'boolean', width: '100px' },
    { key: 'containsLatex', label: 'Contains Latex', editable: true, required: false, type: 'boolean', width: '120px' },
    { key: 'containsPhthalate', label: 'Contains Phthalate', editable: true, required: false, type: 'boolean', width: '150px' },
    { key: 'productionDate', label: 'Production Date', editable: true, required: false, type: 'date', width: '150px' },
    { key: 'expirationDate', label: 'Expiration Date', editable: true, required: false, type: 'date', width: '150px' },
    { key: 'lotNumber', label: 'Lot #', editable: true, required: false, width: '120px' },
    { key: 'serialNumber', label: 'Serial #', editable: true, required: false, width: '120px' },
    { key: 'status', label: 'Status', editable: false, required: false, width: '100px' },
  ];

  // Get frozen and non-frozen columns
  const frozenColumns = columns.filter(col => col.frozen);
  const scrollableColumns = columns.filter(col => !col.frozen);

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
    cancelEditing,
    toggleLock,
    isColumnFiltered,
  };
};
