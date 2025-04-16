
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { UDIRecord, DataSheet } from '@/types/udi';
import DataTableContent from './DataTableContent';
import { UDITableColumn } from '@/types/udi';
import { FilterOption } from '@/lib/filterUtils';

interface SheetTabsProps {
  activeSheet: string;
  setActiveSheet: (sheet: string) => void;
  sheets: DataSheet[];
  records: UDIRecord[];
  columns: UDITableColumn[];
  frozenColumns: UDITableColumn[];
  scrollableColumns: UDITableColumn[];
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
  activeFilters?: FilterOption[];
}

const SheetTabs: React.FC<SheetTabsProps> = ({
  activeSheet,
  setActiveSheet,
  sheets,
  records,
  frozenColumns,
  scrollableColumns,
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
  // Count the number of records with issues
  const invalidCount = records.filter(r => r.status === 'invalid').length;
  const warningCount = records.filter(r => r.status === 'warning').length;
  
  return (
    <Tabs value={activeSheet} onValueChange={setActiveSheet} className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="flex-grow-0">
          {sheets.map(sheet => (
            <TabsTrigger key={sheet.id} value={sheet.id} className="flex items-center gap-2">
              {sheet.icon}
              {sheet.name}
              {sheet.id === 'basic' && (invalidCount > 0 || warningCount > 0) && (
                <span className={`ml-1 text-xs font-medium px-1.5 py-0.5 rounded-full ${
                  invalidCount > 0 ? 'bg-error/20 text-error' : 'bg-warning/20 text-warning'
                }`}>
                  {invalidCount > 0 ? invalidCount : warningCount}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Sheet
        </Button>
      </div>
      
      <TabsContent value="basic" className="mt-2">
        <DataTableContent
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
        />
      </TabsContent>
    </Tabs>
  );
};

export default SheetTabs;
