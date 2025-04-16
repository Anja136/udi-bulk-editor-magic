
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedField("");
      setNewValue("");
    }
  }, [open]);

  const handleApplyChanges = () => {
    if (!selectedField) return;

    // Count how many records will actually be updated (unlocked records)
    const unlockedCount = filteredRecords.filter(record => !record.isLocked).length;

    // Update all unlocked records in the filtered set
    const updatedRecords = filteredRecords.map(record => {
      // Skip locked records
      if (record.isLocked) return record;

      // Create a deep copy of the record to avoid mutations
      const updatedRecord = { ...record };
      
      // Handle different field types
      if (['singleUse', 'sterilized', 'containsLatex', 'containsPhthalate'].includes(selectedField)) {
        // For boolean fields
        updatedRecord[selectedField] = newValue === "YES";
      } else if (selectedField === 'status') {
        // For status field (which is an enum)
        updatedRecord.status = newValue as any;
      } else {
        // For all other fields (strings, numbers, dates)
        updatedRecord[selectedField] = newValue;
      }

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
  };

  // Display a message with the number of records that will be affected
  const getAffectedRecordsCount = () => {
    const unlocked = filteredRecords.filter(record => !record.isLocked).length;
    return `${unlocked} of ${filteredRecords.length} records will be updated (${filteredRecords.length - unlocked} are locked)`;
  };

  // Is the selected field a boolean type?
  const isBooleanField = ['singleUse', 'sterilized', 'containsLatex', 'containsPhthalate'].includes(selectedField);
  
  // Determine if the field is a date type
  const isDateField = ['productionDate', 'expirationDate'].includes(selectedField);

  // Is the field a multiline text field?
  const isMultilineField = false; // Add any multiline fields here if needed

  // Active filters display
  const renderActiveFilters = () => {
    if (activeFilters.length === 0) return null;
    
    return (
      <div className="mt-2 text-xs p-2 bg-muted rounded-sm">
        <span className="font-semibold">Active filters: </span>
        {activeFilters.map((filter, idx) => (
          <span key={idx}>
            {columns.find(c => c.key === filter.column)?.label || filter.column}: {filter.value}
            {idx < activeFilters.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
    );
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
            {renderActiveFilters()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="field" className="text-right text-sm">
              Field to change
            </label>
            <Select 
              value={selectedField} 
              onValueChange={(value) => {
                setSelectedField(value);
                setNewValue(""); // Reset value when field changes
              }}
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
            
            {isBooleanField ? (
              <Select
                value={newValue}
                onValueChange={setNewValue}
                disabled={!selectedField}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">YES</SelectItem>
                  <SelectItem value="NO">NO</SelectItem>
                </SelectContent>
              </Select>
            ) : isDateField ? (
              <Input
                id="value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="col-span-3"
                disabled={!selectedField}
                type="date"
                placeholder="YYYY-MM-DD"
              />
            ) : isMultilineField ? (
              <Textarea
                id="value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="col-span-3 min-h-[80px]"
                disabled={!selectedField}
                placeholder="Enter value..."
              />
            ) : (
              <Input
                id="value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="col-span-3"
                disabled={!selectedField}
                placeholder="Enter value..."
              />
            )}
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
