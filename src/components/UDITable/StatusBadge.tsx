
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UDIRecord } from '@/types/udi';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StatusBadgeProps {
  record: UDIRecord;
}

const StatusBadge = ({ record }: StatusBadgeProps) => {
  const { status, errors, warnings } = record;
  
  switch (status) {
    case 'valid':
      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          Valid
        </Badge>
      );
    case 'warning':
      return (
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
    case 'invalid':
      return (
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
    default:
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          Pending
        </Badge>
      );
  }
};

export default StatusBadge;
