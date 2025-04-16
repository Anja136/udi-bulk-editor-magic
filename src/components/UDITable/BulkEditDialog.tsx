
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import { validateRecord } from '@/lib/validators';
import { FilterOption } from '@/lib/filterUtils';
import { PencilLine } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BulkEditDialogProps {
  filteredRecords: UDIRecord[];
  columns: UDITableColumn[];
  activeFilters: FilterOption[];
  onRecordsUpdate: (updatedRecords: UDIRecord[]) => void;
}

const BulkEditDialog = ({ 
  filteredRecords, 
  columns, 
  activeFilters, 
  onRecordsUpdate 
}: BulkEditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const { toast } = useToast();

  // Only show editable columns
  const editableColumns = columns.filter(col => col.editable);

  const handleApplyChanges = () => {
    if (!selectedField || !newValue) return;

    // Count how many records will actually be updated (unlocked records)
    const unlockedCount = filteredRecords.filter(record => !record.isLocked).length;

    // Update all unlocked records in the filtered set
    const updatedRecords = filteredRecords.map(record => {
      // Skip locked records
      if (record.isLocked) return record;

      // Update the selected field for unlocked records
      const updatedRecord = {
        ...record,
        [selectedField]: newValue
      };

      // Validate the record with the new value
      return validateRecord(updatedRecord);
    });

    onRecordsUpdate(updatedRecords);
    
    // Show a toast notification to confirm the changes
    toast({
      title: "Bulk edit complete",
      description: `Updated ${unlockedCount} records with new ${selectedField} value.`,
    });
    
    setOpen(false);
    setNewValue("");
    setSelectedField("");
  };

  // Display a message with the number of records that will be affected
  const getAffectedRecordsCount = () => {
    const unlocked = filteredRecords.filter(record => !record.isLocked).length;
    return `${unlocked} of ${filteredRecords.length} records will be updated (${filteredRecords.length - unlocked} are locked)`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <PencilLine className="h-4 w-4" />
          Bulk Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Edit Records</DialogTitle>
          <DialogDescription>
            Change values for all {filteredRecords.length} filtered records at once.
            {activeFilters.length > 0 && (
              <div className="mt-2 text-xs p-2 bg-muted rounded-sm">
                <span className="font-semibold">Active filters: </span>
                {activeFilters.map((filter, idx) => (
                  <span key={idx}>
                    {columns.find(c => c.key === filter.column)?.label || filter.column}: {filter.value}
                    {idx < activeFilters.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="field" className="text-right text-sm">
              Field to change
            </label>
            <Select 
              value={selectedField} 
              onValueChange={setSelectedField}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                {editableColumns.map((column) => (
                  <SelectItem key={column.key} value={column.key}>
                    {column.label} {column.required && <span className="text-destructive">*</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="value" className="text-right text-sm">
              New value
            </label>
            <Input
              id="value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="col-span-3"
              disabled={!selectedField}
            />
          </div>
          {filteredRecords.length > 0 && (
            <div className="text-xs text-muted-foreground mt-2">
              {getAffectedRecordsCount()}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApplyChanges}
            disabled={!selectedField || !newValue}
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkEditDialog;
