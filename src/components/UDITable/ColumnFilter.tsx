
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, Search, X } from 'lucide-react';
import { UDIRecord } from '@/types/udi';
import { getUniqueColumnValues } from '@/lib/filterUtils';

interface ColumnFilterProps {
  column: string;
  records: UDIRecord[];
  onApplyFilter: (column: string, value: string) => void;
  onClearFilter: (column: string) => void;
  isFiltered: boolean;
  currentValue?: string;
}

const ColumnFilter = ({
  column,
  records,
  onApplyFilter,
  onClearFilter,
  isFiltered,
  currentValue
}: ColumnFilterProps) => {
  // Only exclude the Status column from filtering
  if (column === 'status') return null;
  
  // For the actions column, we'll filter based on the locked status
  const uniqueValues = column === 'actions' 
    ? ['Locked', 'Unlocked'] 
    : getUniqueColumnValues(records, column);
    
  const [localSearchValue, setLocalSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  
  const filteredValues = !localSearchValue 
    ? uniqueValues 
    : uniqueValues.filter(value => 
        value.toLowerCase().includes(localSearchValue.toLowerCase())
      );
  
  const handleClearFilter = () => {
    onClearFilter(column);
    setOpen(false);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
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
                  onClick={() => {
                    onApplyFilter(column, value);
                    setOpen(false);
                  }}
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
              onClick={handleClearFilter}
            >
              Clear Filter
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ColumnFilter;
