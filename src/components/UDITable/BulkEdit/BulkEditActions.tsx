
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface BulkEditActionsProps {
  onCancel: () => void;
  onApply: () => void;
  isValid: boolean;
}

const BulkEditActions = ({ onCancel, onApply, isValid }: BulkEditActionsProps) => {
  return (
    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button 
        onClick={onApply}
        disabled={!isValid}
      >
        Apply Changes
      </Button>
    </DialogFooter>
  );
};

export default BulkEditActions;
