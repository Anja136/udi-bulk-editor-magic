
import { UDIRecord } from '@/types/udi';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface ValidationSummaryProps {
  records: UDIRecord[];
}

const ValidationSummary = ({ records }: ValidationSummaryProps) => {
  if (records.length === 0) return null;
  
  // Count records with errors and warnings
  const invalidRecords = records.filter(r => r.status === 'invalid').length;
  const warningRecords = records.filter(r => r.status === 'warning').length;
  const validRecords = records.length - invalidRecords - warningRecords;
  
  // Calculate percentages for progress bar
  const validPercentage = (validRecords / records.length) * 100;
  const warningPercentage = (warningRecords / records.length) * 100;
  const errorPercentage = (invalidRecords / records.length) * 100;
  
  return (
    <Alert 
      variant={invalidRecords > 0 ? "destructive" : "default"} 
      className={invalidRecords > 0 ? "border-error" : warningRecords > 0 ? "border-warning" : "border-success"}
    >
      {invalidRecords > 0 ? (
        <AlertCircle className="h-4 w-4" />
      ) : warningRecords > 0 ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      
      <AlertTitle>Data Validation Summary</AlertTitle>
      <AlertDescription>
        <div className="space-y-2 mt-2">
          <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
            {validPercentage > 0 && (
              <div 
                className="absolute h-full bg-success" 
                style={{ width: `${validPercentage}%`, left: '0' }}
              />
            )}
            {warningPercentage > 0 && (
              <div 
                className="absolute h-full bg-warning" 
                style={{ width: `${warningPercentage}%`, left: `${validPercentage}%` }}
              />
            )}
            {errorPercentage > 0 && (
              <div 
                className="absolute h-full bg-error" 
                style={{ width: `${errorPercentage}%`, left: `${validPercentage + warningPercentage}%` }}
              />
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-md bg-success/10">
              <div className="text-sm font-medium text-success">{validRecords}</div>
              <div className="text-xs text-success">Valid</div>
            </div>
            
            <div className="text-center p-2 rounded-md bg-warning/10">
              <div className="text-sm font-medium text-warning">{warningRecords}</div>
              <div className="text-xs text-warning">Warnings</div>
            </div>
            
            <div className="text-center p-2 rounded-md bg-error/10">
              <div className="text-sm font-medium text-error">{invalidRecords}</div>
              <div className="text-xs text-error">Errors</div>
            </div>
          </div>
          
          <div className="text-xs mt-1 text-muted-foreground">
            Fields with issues are highlighted. Detailed validation is available in the Data Editor.
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ValidationSummary;
