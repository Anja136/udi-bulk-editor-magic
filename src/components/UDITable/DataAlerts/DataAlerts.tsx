
import React from 'react';
import { UDIRecord } from '@/types/udi';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface DataAlertsProps {
  records: UDIRecord[];
}

const DataAlerts: React.FC<DataAlertsProps> = ({ records }) => {
  // Count records with errors and warnings
  const invalidRecords = records.filter(r => r.status === 'invalid').length;
  const warningRecords = records.filter(r => r.status === 'warning').length;
  
  if (invalidRecords === 0 && warningRecords === 0) return null;
  
  return (
    <Alert variant={invalidRecords > 0 ? "destructive" : "default"} className={invalidRecords > 0 ? "border-error" : "border-warning"}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Data Issues Detected</AlertTitle>
      <AlertDescription>
        {invalidRecords > 0 && (
          <div className="text-error font-medium">
            {invalidRecords} record{invalidRecords !== 1 ? 's' : ''} with validation errors
          </div>
        )}
        {warningRecords > 0 && (
          <div className="text-warning font-medium">
            {warningRecords} record{warningRecords !== 1 ? 's' : ''} with warnings
          </div>
        )}
        <div className="text-xs mt-1 text-muted-foreground">
          Fields with issues are highlighted in the table. Hover over icons to see error details.
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DataAlerts;
