
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileCheck } from 'lucide-react';

interface FileInfoProps {
  file: File;
  isLoading: boolean;
  onProcess: () => void;
}

const FileInfo = ({ file, isLoading, onProcess }: FileInfoProps) => {
  return (
    <div className="mt-4 flex items-center justify-between rounded border p-3">
      <div className="flex items-center space-x-2">
        <FileCheck className="h-5 w-5 text-primary" />
        <span className="font-medium">{file.name}</span>
        <span className="text-xs text-muted-foreground">
          ({(file.size / 1024).toFixed(2)} KB)
        </span>
      </div>
      <Button
        onClick={onProcess}
        disabled={isLoading}
        size="sm"
      >
        {isLoading ? "Processing..." : "Process File"}
      </Button>
    </div>
  );
};

export default FileInfo;
