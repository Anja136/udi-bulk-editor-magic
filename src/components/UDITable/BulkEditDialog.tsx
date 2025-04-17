
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import { validateRecord } from '@/lib/validators';
import { FilterOption } from '@/lib/filterUtils';
import { PencilLine } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Import refactored components
import FieldSelector from './BulkEdit/FieldSelector';
import BulkEditField from './BulkEdit/BulkEditField';
import ActiveFiltersDisplay from './BulkEdit/ActiveFiltersDisplay';
import AffectedRecordsInfo from './BulkEdit/AffectedRecordsInfo';
import BulkEditActions from './BulkEdit/BulkEditActions';

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

  // Is the selected field a boolean type?
  const isBooleanField = ['singleUse', 'sterilized', 'containsLatex', 'containsPhthalate'].includes(selectedField);
  
  // Determine if the field is a date type
  const isDateField = ['productionDate', 'expirationDate'].includes(selectedField);

  // Is the field a multiline text field?
  const isMultilineField = false; // Add any multiline fields here if needed

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
            <ActiveFiltersDisplay 
              activeFilters={activeFilters} 
              columns={columns} 
            />
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="field" className="text-right text-sm">
              Field to change
            </label>
            <FieldSelector 
              columns={columns}
              selectedField={selectedField}
              onFieldChange={(value) => {
                setSelectedField(value);
                setNewValue(""); // Reset value when field changes
              }}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="value" className="text-right text-sm">
              New value
            </label>
            <BulkEditField 
              selectedField={selectedField}
              newValue={newValue}
              onValueChange={setNewValue}
              isBooleanField={isBooleanField}
              isDateField={isDateField}
              isMultilineField={isMultilineField}
            />
          </div>
          
          <AffectedRecordsInfo filteredRecords={filteredRecords} />
        </div>
        
        <BulkEditActions 
          onCancel={() => setOpen(false)}
          onApply={handleApplyChanges}
          isValid={!!selectedField && !!newValue}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BulkEditDialog;
