
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { UDIRecord, DataSheet } from '@/types/udi';
import DataTableContent from './DataTableContent';
import { UDITableColumn } from '@/types/udi';
import { FilterOption } from '@/lib/filterUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  isColumnFiltered: (column: string) => boolean;
  onApplyFilter: (column: string, value: string) => void;
  onClearFilter: (column: string) => void;
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
  const invalidRecords = records.filter(r => r.status === 'invalid').length;
  const warningRecords = records.filter(r => r.status === 'warning').length;
  
  // Get a summary of the affected devices and errors
  const getErrorSummary = () => {
    if (invalidRecords === 0 && warningRecords === 0) return null;
    
    const invalidDevices = records
      .filter(r => r.status === 'invalid')
      .map(r => ({ id: r.deviceIdentifier, name: r.productName, errors: r.errors || [] }));
    
    const warningDevices = records
      .filter(r => r.status === 'warning')
      .map(r => ({ id: r.deviceIdentifier, name: r.productName, warnings: r.warnings || [] }));
    
    return { invalidDevices, warningDevices };
  };
  
  const errorSummary = getErrorSummary();
  
  return (
    <Tabs value={activeSheet} onValueChange={setActiveSheet} className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="flex-grow-0">
          {sheets.map(sheet => (
            <TabsTrigger key={sheet.id} value={sheet.id} className="flex items-center gap-2">
              {sheet.icon}
              {sheet.name}
              {sheet.id === 'basic' && invalidRecords > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-1 text-xs font-medium px-1.5 py-0.5 rounded-full bg-error/20 text-error flex items-center">
                        <AlertCircle className="h-3 w-3 mr-0.5" />
                        {invalidRecords}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md bg-error/10 border-error">
                      <div className="text-sm font-medium mb-1">Devices with Errors:</div>
                      <div className="max-h-52 overflow-y-auto">
                        {errorSummary?.invalidDevices.map((device, idx) => (
                          <div key={idx} className="mb-2">
                            <div className="text-xs font-medium">{device.id} - {device.name}</div>
                            <ul className="text-xs list-disc ml-4">
                              {device.errors.map((err, errIdx) => (
                                <li key={errIdx}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {sheet.id === 'basic' && invalidRecords === 0 && warningRecords > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-1 text-xs font-medium px-1.5 py-0.5 rounded-full bg-warning/20 text-warning flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-0.5" />
                        {warningRecords}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md bg-warning/10 border-warning">
                      <div className="text-sm font-medium mb-1">Devices with Warnings:</div>
                      <div className="max-h-52 overflow-y-auto">
                        {errorSummary?.warningDevices.map((device, idx) => (
                          <div key={idx} className="mb-2">
                            <div className="text-xs font-medium">{device.id} - {device.name}</div>
                            <ul className="text-xs list-disc ml-4">
                              {device.warnings.map((warn, warnIdx) => (
                                <li key={warnIdx}>{warn}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
