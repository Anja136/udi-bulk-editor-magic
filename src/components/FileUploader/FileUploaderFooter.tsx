
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface FileUploaderFooterProps {
  isLoading: boolean;
  onLoadDemoData: () => void;
}

const FileUploaderFooter = ({ isLoading, onLoadDemoData }: FileUploaderFooterProps) => {
  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center text-sm">
        <AlertCircle className="mr-1 h-4 w-4 text-warning" />
        <span>Supported formats: CSV, XLSX, XLS</span>
      </div>
      <Button variant="link" onClick={onLoadDemoData} disabled={isLoading}>
        Load Demo Data
      </Button>
    </div>
  );
};

export default FileUploaderFooter;
