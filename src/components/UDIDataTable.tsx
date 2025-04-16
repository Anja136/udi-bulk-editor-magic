
import { useState, useEffect } from 'react';
import { UDIRecord, UDITableColumn, DataSheet } from '@/types/udi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { validateRecord } from '@/lib/validators';
import { FilterOption, createColumnFilter } from '@/lib/filterUtils';
import ColumnFilter from './UDITable/ColumnFilter';
import ActiveFilters from './UDITable/ActiveFilters';
import EditableCell from './UDITable/EditableCell';
import RowActions from './UDITable/RowActions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, List, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GMDNSheet from './UDITable/GMDNSheet';

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
  const [activeSheet, setActiveSheet] = useState<string>('basic');
  
  const sheets: DataSheet[] = [
    { id: 'basic', name: 'Basic Information', type: 'basic', icon: <FileText className="h-4 w-4" /> },
    { id: 'gmdn', name: 'GMDN Codes', type: 'gmdn', icon: <List className="h-4 w-4" /> },
  ];
  
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
    <div className="w-full space-y-4">
      {activeFilters && activeFilters.length > 0 && (
        <ActiveFilters 
          activeFilters={activeFilters}
          columns={columns}
          filteredRecords={records}
          onClearColumnFilter={clearColumnFilter}
          onClearAllFilters={() => onFilterChange?.([])}
          onDataChange={handleBulkUpdate}
        />
      )}
      
      <Tabs value={activeSheet} onValueChange={setActiveSheet} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            {sheets.map(sheet => (
              <TabsTrigger key={sheet.id} value={sheet.id} className="flex items-center gap-2">
                {sheet.icon}
                {sheet.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Sheet
          </Button>
        </div>
        
        <TabsContent value="basic" className="mt-4">
          <div className="border rounded-md">
            <div className="overflow-auto">
              <div className="flex flex-row">
                {/* Frozen columns section */}
                <div className="sticky left-0 z-10 bg-background shadow-sm">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-12 text-center sticky left-0 z-20 bg-muted/50">Actions</TableHead>
                        {frozenColumns.map((column) => (
                          <TableHead key={column.key} className="sticky left-0 z-20 bg-muted/50" style={{ width: column.width }}>
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
                          <TableCell colSpan={frozenColumns.length + 1} className="text-center py-8">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map((record) => (
                          <TableRow key={`frozen-${record.id}`} className={record.status === 'invalid' ? 'bg-error/5' : record.status === 'warning' ? 'bg-warning/5' : ''}>
                            <TableCell className="text-center sticky left-0 z-20 bg-background">
                              <RowActions 
                                isLocked={record.isLocked}
                                onToggleLock={() => toggleLock(record.id)}
                              />
                            </TableCell>
                            {frozenColumns.map((column) => (
                              <TableCell key={`${record.id}-${column.key}`} className="sticky left-0 z-20 bg-background">
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
                
                {/* Scrollable columns section */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        {scrollableColumns.map((column) => (
                          <TableHead key={column.key} style={{ width: column.width }}>
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
                          <TableCell colSpan={scrollableColumns.length} className="text-center py-8">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map((record) => (
                          <TableRow key={`scrollable-${record.id}`} className={record.status === 'invalid' ? 'bg-error/5' : record.status === 'warning' ? 'bg-warning/5' : ''}>
                            {scrollableColumns.map((column) => (
                              <TableCell key={`${record.id}-${column.key}`}>
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
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="gmdn" className="mt-4">
          <GMDNSheet records={records} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UDIDataTable;
