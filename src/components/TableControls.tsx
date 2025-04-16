
import { Button } from '@/components/ui/button';
import { UDIRecord } from '@/types/udi';
import { validateRecords } from '@/lib/validators';
import { useToast } from '@/components/ui/use-toast';
import { Download, Save, Trash, Lock, Unlock, Filter, CheckCircle, AlertCircle } from 'lucide-react';

interface TableControlsProps {
  data: UDIRecord[];
  onDataChange: (data: UDIRecord[]) => void;
  onClearData: () => void;
}

const TableControls = ({ data, onDataChange, onClearData }: TableControlsProps) => {
  const { toast } = useToast();

  const validateAll = () => {
    const validatedData = validateRecords(data);
    onDataChange(validatedData);
    
    const invalidCount = validatedData.filter(r => r.status === 'invalid').length;
    const warningCount = validatedData.filter(r => r.status === 'warning').length;
    const validCount = validatedData.filter(r => r.status === 'valid').length;
    
    if (invalidCount > 0) {
      toast({
        title: 'Validation complete',
        description: `Found ${invalidCount} invalid records, ${warningCount} warnings, and ${validCount} valid records.`,
        variant: 'destructive',
      });
    } else if (warningCount > 0) {
      toast({
        title: 'Validation complete',
        description: `All records are valid with ${warningCount} warnings.`,
        variant: 'default',
      });
    } else {
      toast({
        title: 'Validation complete',
        description: 'All records are valid!',
        variant: 'default',
      });
    }
  };

  const lockAll = () => {
    const updatedData = data.map(record => ({ ...record, isLocked: true }));
    onDataChange(updatedData);
    toast({
      title: 'All records locked',
      description: 'All records have been locked for editing.',
      variant: 'default',
    });
  };

  const unlockAll = () => {
    const updatedData = data.map(record => ({ ...record, isLocked: false }));
    onDataChange(updatedData);
    toast({
      title: 'All records unlocked',
      description: 'All records can now be edited.',
      variant: 'default',
    });
  };

  const handleImport = () => {
    const invalidCount = data.filter(r => r.status === 'invalid').length;
    
    if (invalidCount > 0) {
      toast({
        title: 'Import failed',
        description: `Cannot import data with ${invalidCount} invalid records. Please fix all errors first.`,
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, this would send the data to an API
    toast({
      title: 'Import successful',
      description: `${data.length} records have been imported successfully.`,
      variant: 'default',
    });
  };

  const exportData = () => {
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'udi-data-export.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful',
        description: `${data.length} records have been exported to JSON.`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was a problem exporting the data.',
        variant: 'destructive',
      });
    }
  };

  const validRecords = data.filter(r => r.status === 'valid').length;
  const invalidRecords = data.filter(r => r.status === 'invalid').length;
  const warningRecords = data.filter(r => r.status === 'warning').length;

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={validateAll} variant="outline" className="flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          Validate All
        </Button>
        <Button onClick={lockAll} variant="outline" className="flex items-center">
          <Lock className="mr-2 h-4 w-4" />
          Lock All
        </Button>
        <Button onClick={unlockAll} variant="outline" className="flex items-center">
          <Unlock className="mr-2 h-4 w-4" />
          Unlock All
        </Button>
        <Button onClick={exportData} variant="outline" className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button onClick={onClearData} variant="outline" className="flex items-center text-destructive hover:text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button onClick={handleImport} className="ml-auto flex items-center">
          <Save className="mr-2 h-4 w-4" />
          Import
        </Button>
      </div>
      
      {data.length > 0 && (
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <CheckCircle className="mr-1 h-4 w-4 text-success" />
            <span>{validRecords} valid records</span>
          </div>
          {warningRecords > 0 && (
            <div className="flex items-center">
              <AlertCircle className="mr-1 h-4 w-4 text-warning" />
              <span>{warningRecords} warnings</span>
            </div>
          )}
          {invalidRecords > 0 && (
            <div className="flex items-center">
              <AlertCircle className="mr-1 h-4 w-4 text-error" />
              <span>{invalidRecords} invalid records</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TableControls;
