
import { useState, useEffect } from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit, Save, Lock, Unlock, AlertCircle, CheckCircle, AlertTriangle, Filter, Search, X } from 'lucide-react';
import { validateRecord } from '@/lib/validators';
import { FilterOption, getUniqueColumnValues, createColumnFilter, filterRecords } from '@/lib/filterUtils';

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
  const [searchValue, setSearchValue] = useState<string>('');
  
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

  const getStatusIcon = (status: UDIRecord['status']) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-error" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (record: UDIRecord) => {
    const { status, errors, warnings } = record;
    
    let badgeContent;
    switch (status) {
      case 'valid':
        badgeContent = (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Valid
          </Badge>
        );
        break;
      case 'warning':
        badgeContent = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex">
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Warning
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  {warnings?.map((warning, idx) => (
                    <div key={idx} className="text-xs">{warning}</div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
        break;
      case 'invalid':
        badgeContent = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex">
                  <Badge variant="outline" className="bg-error/10 text-error border-error/20">
                    <AlertCircle className="h-3 w-3 mr-1" /> Invalid
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  {errors?.map((error, idx) => (
                    <div key={idx} className="text-xs">{error}</div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
        break;
      default:
        badgeContent = (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            Pending
          </Badge>
        );
    }
    
    return badgeContent;
  };

  const filterSearch = (uniqueValues: string[], searchTerm: string) => {
    if (!searchTerm) return uniqueValues;
    return uniqueValues.filter(value => 
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const ColumnFilterPopover = ({ column }: { column: keyof UDIRecord }) => {
    // Don't create filter UI for the Status column
    if (column === 'status') return null;
    
    const uniqueValues = getUniqueColumnValues(records, column);
    const isFiltered = isColumnFiltered(column);
    const currentValue = activeFilters?.find(f => f.column === column)?.value;
    const [localSearchValue, setLocalSearchValue] = useState('');
    const filteredValues = filterSearch(uniqueValues, localSearchValue);
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className={isFiltered ? "text-primary" : "text-muted-foreground"}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0 z-50" align="start">
          <div className="p-2 border-b">
            <div className="flex items-center space-x-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search values..." 
                className="h-8 flex-1"
                value={localSearchValue}
                onChange={(e) => setLocalSearchValue(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-[200px] overflow-auto">
            {filteredValues.length > 0 ? (
              <div className="grid grid-cols-1 p-2 gap-1">
                {filteredValues.map((value, idx) => (
                  <Button
                    key={idx}
                    variant={currentValue === value ? "default" : "ghost"}
                    size="sm"
                    className="justify-start font-normal"
                    onClick={() => applyFilter(column, value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No values found
              </div>
            )}
          </div>
          {isFiltered && (
            <div className="p-2 border-t flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => clearColumnFilter(column)}
              >
                Clear Filter
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="w-full overflow-auto">
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 p-2 bg-muted/30 rounded-md">
          <span className="text-sm font-medium px-2 py-1">Active filters:</span>
          {activeFilters.map((filter, idx) => {
            const columnDef = columns.find(c => c.key === filter.column);
            return (
              <Badge 
                key={idx} 
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                {columnDef?.label || filter.column}: {filter.value}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => clearColumnFilter(filter.column)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => onFilterChange?.([])}
          >
            Clear all
          </Button>
        </div>
      )}
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
                  <ColumnFilterPopover column={column.key as keyof UDIRecord} />
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleLock(record.id)}
                    className={record.isLocked ? 'text-muted-foreground' : 'text-primary'}
                    title={record.isLocked ? "Unlock to edit" : "Lock editing"}
                  >
                    {record.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                </TableCell>
                
                {columns.map((column) => (
                  <TableCell key={`${record.id}-${column.key}`} className="relative">
                    {editingCell && editingCell.rowId === record.id && editingCell.column === column.key ? (
                      <div className="flex items-center space-x-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8 w-full"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                        <Button variant="ghost" size="icon" onClick={handleSave} title="Save">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={cancelEditing} title="Cancel">
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className={`flex items-center ${column.editable && !record.isLocked ? 'cursor-pointer hover:bg-secondary/50 p-1 rounded transition-colors' : ''}`}
                        onClick={() => column.editable && startEditing(record, column.key)}
                      >
                        {column.key === 'status' ? (
                          getStatusBadge(record)
                        ) : (
                          <div className="flex items-center w-full">
                            <span className="truncate">
                              {String(record[column.key as keyof UDIRecord] || '')}
                            </span>
                            {column.editable && !record.isLocked && (
                              <Edit className="h-3 w-3 ml-1 text-muted-foreground opacity-50" />
                            )}
                          </div>
                        )}
                      </div>
                    )}
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
