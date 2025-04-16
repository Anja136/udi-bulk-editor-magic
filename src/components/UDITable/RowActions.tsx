
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Unlock } from 'lucide-react';

interface RowActionsProps {
  isLocked: boolean;
  onToggleLock: () => void;
}

const RowActions = ({ isLocked, onToggleLock }: RowActionsProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleLock}
      className={isLocked ? 'text-muted-foreground' : 'text-primary'}
      title={isLocked ? "Unlock to edit" : "Lock editing"}
    >
      {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
    </Button>
  );
};

export default RowActions;
