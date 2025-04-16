
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
          <CheckCircle className="h-3 w-3 mr-1" /> Valid
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
            <TooltipContent className="bg-warning/10 border-warning">
              <div className="max-w-xs">
                <div className="text-sm font-medium mb-1">Warning Details:</div>
                {warnings?.map((warning, idx) => (
                  <div key={idx} className="text-xs flex items-start gap-1">
                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{warning}</span>
                  </div>
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
            <TooltipContent className="bg-error/10 border-error">
              <div className="max-w-xs">
                <div className="text-sm font-medium mb-1">Error Details:</div>
                {errors?.map((error, idx) => (
                  <div key={idx} className="text-xs flex items-start gap-1">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
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
