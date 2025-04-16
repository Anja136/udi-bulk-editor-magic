
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UDIRecord } from '@/types/udi';
import { validateRecords } from '@/lib/validators';
import { useToast } from '@/components/ui/use-toast';
import { 
  Download, Save, Trash, Lock, Unlock, Filter, CheckCircle, 
  AlertCircle, FilterX, Search 
} from 'lucide-react';
import { FilterOption } from '@/lib/filterUtils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TableControlsProps {
  data: UDIRecord[];
  onDataChange: (data: UDIRecord[]) => void;
  onClearData: () => void;
  onFilterChange?: (filters: FilterOption[]) => void;
  activeFilters?: FilterOption[];
}

const TableControls = ({ 
  data, 
  onDataChange, 
  onClearData, 
  onFilterChange,
  activeFilters = [] 
}: TableControlsProps) => {
  const { toast } = useToast();
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterColumn, setFilterColumn] = useState<string>('modelNumber');
  const [filterOperation, setFilterOperation] = useState<FilterOption['operation']>('contains');
  const [filterValue, setFilterValue] = useState('');

  const columnOptions: Array<{value: string; label: string}> = [
    { value: 'deviceIdentifier', label: 'Device Identifier' },
    { value: 'manufacturerName', label: 'Manufacturer' },
    { value: 'productName', label: 'Product' },
    { value: 'modelNumber', label: 'Model #' },
    { value: 'lotNumber', label: 'Lot #' },
    { value: 'serialNumber', label: 'Serial #' },
  ];

  const operationOptions = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
  ];

  const addFilter = () => {
    if (!filterValue.trim()) return;
    
    const newFilter: FilterOption = {
      column: filterColumn,
      operation: filterOperation,
      value: filterValue
    };
    
    const updatedFilters = [...activeFilters, newFilter];
    onFilterChange?.(updatedFilters);
    setFilterValue('');
    
    toast({
      title: 'Filter added',
      description: `Filtering ${filterColumn} ${filterOperation} "${filterValue}"`,
    });
  };

  const removeFilter = (index: number) => {
    const updatedFilters = activeFilters.filter((_, i) => i !== index);
    onFilterChange?.(updatedFilters);
  };

  const clearFilters = () => {
    onFilterChange?.([]);
    setShowFilterPanel(false);
  };

  const validateAll = () => {
    const validatedData = validateRecords(data);
    onDataChange(validatedData);
    
    const invalidCount = validatedData.filter(r => r.status === 'invalid').length;
    const warningCount = validatedData.filter(r => r.status === 'warning').length;
    const validCount = validatedData.filter(r => r.status === 'valid').length;
    
    if (invalidCount > 0) {
      toast({
        title: 'Validation complete',
        description: `Found ${invalidCount} invalid records, ${warningCount} warnings, and ${validCount} valid records.`,
        variant: 'destructive',
      });
    } else if (warningCount > 0) {
      toast({
        title: 'Validation complete',
        description: `All records are valid with ${warningCount} warnings.`,
        variant: 'default',
      });
    } else {
      toast({
        title: 'Validation complete',
        description: 'All records are valid!',
        variant: 'default',
      });
    }
  };

  const lockAll = () => {
    const updatedData = data.map(record => ({ ...record, isLocked: true }));
    onDataChange(updatedData);
    toast({
      title: 'All records locked',
      description: 'All records have been locked for editing.',
      variant: 'default',
    });
  };

  const unlockAll = () => {
    const updatedData = data.map(record => ({ ...record, isLocked: false }));
    onDataChange(updatedData);
    toast({
      title: 'All records unlocked',
      description: 'All records can now be edited.',
      variant: 'default',
    });
  };

  const handleImport = () => {
    const invalidCount = data.filter(r => r.status === 'invalid').length;
    
    if (invalidCount > 0) {
      toast({
        title: 'Import failed',
        description: `Cannot import data with ${invalidCount} invalid records. Please fix all errors first.`,
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, this would send the data to an API
    toast({
      title: 'Import successful',
      description: `${data.length} records have been imported successfully.`,
      variant: 'default',
    });
  };

  const exportData = () => {
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'udi-data-export.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful',
        description: `${data.length} records have been exported to JSON.`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was a problem exporting the data.',
        variant: 'destructive',
      });
    }
  };

  const validRecords = data.filter(r => r.status === 'valid').length;
  const invalidRecords = data.filter(r => r.status === 'invalid').length;
  const warningRecords = data.filter(r => r.status === 'warning').length;

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={validateAll} variant="outline" className="flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          Validate All
        </Button>
        <Button onClick={lockAll} variant="outline" className="flex items-center">
          <Lock className="mr-2 h-4 w-4" />
          Lock All
        </Button>
        <Button onClick={unlockAll} variant="outline" className="flex items-center">
          <Unlock className="mr-2 h-4 w-4" />
          Unlock All
        </Button>
        <Button 
          onClick={() => setShowFilterPanel(!showFilterPanel)} 
          variant={activeFilters.length > 0 ? "default" : "outline"} 
          className="flex items-center"
        >
          {activeFilters.length > 0 ? <FilterX className="mr-2 h-4 w-4" /> : <Search className="mr-2 h-4 w-4" />}
          {activeFilters.length > 0 ? `Filters (${activeFilters.length})` : 'Filter'}
        </Button>
        <Button onClick={exportData} variant="outline" className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button onClick={onClearData} variant="outline" className="flex items-center text-destructive hover:text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button onClick={handleImport} className="ml-auto flex items-center">
          <Save className="mr-2 h-4 w-4" />
          Import
        </Button>
      </div>
      
      {showFilterPanel && (
        <div className="p-4 border rounded-md space-y-4 bg-background/50">
          <div className="text-sm font-medium mb-2">Add Filter</div>
          <div className="flex flex-wrap gap-2">
            <Select value={filterColumn} onValueChange={(value) => setFilterColumn(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Column" />
              </SelectTrigger>
              <SelectContent>
                {columnOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterOperation} onValueChange={(value) => setFilterOperation(value as FilterOption['operation'])}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Operation" />
              </SelectTrigger>
              <SelectContent>
                {operationOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Filter value..."
              className="flex-1 min-w-[200px]"
              onKeyDown={(e) => e.key === 'Enter' && addFilter()}
            />
            
            <Button onClick={addFilter} className="flex items-center">
              Add
            </Button>
            
            {activeFilters.length > 0 && (
              <Button onClick={clearFilters} variant="outline" className="flex items-center">
                <FilterX className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
          
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {activeFilters.map((filter, index) => {
                const columnLabel = columnOptions.find(col => col.value === filter.column)?.label || filter.column;
                const operationLabel = operationOptions.find(op => op.value === filter.operation)?.label || filter.operation;
                
                return (
                  <div 
                    key={index} 
                    className="flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-md"
                  >
                    <span className="font-medium">{columnLabel}</span>
                    <span>{operationLabel}</span>
                    <span className="italic">"{filter.value}"</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1" 
                      onClick={() => removeFilter(index)}
                    >
                      <AlertCircle className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      
      {data.length > 0 && (
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <CheckCircle className="mr-1 h-4 w-4 text-success" />
            <span>{validRecords} valid records</span>
          </div>
          {warningRecords > 0 && (
            <div className="flex items-center">
              <AlertCircle className="mr-1 h-4 w-4 text-warning" />
              <span>{warningRecords} warnings</span>
            </div>
          )}
          {invalidRecords > 0 && (
            <div className="flex items-center">
              <AlertCircle className="mr-1 h-4 w-4 text-error" />
              <span>{invalidRecords} invalid records</span>
            </div>
          )}
          {activeFilters.length > 0 && (
            <div className="flex items-center">
              <Filter className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>Showing {data.length} of {data.length} records</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TableControls;
