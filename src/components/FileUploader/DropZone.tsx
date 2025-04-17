
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  isDragging: boolean;
  isLoading: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DropZone = ({
  isDragging,
  isLoading,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect
}: DropZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-primary/10 p-3">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Upload UDI Data File</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your CSV or Excel file here, or click to browse
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={onFileSelect}
        />
        <Button 
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          disabled={isLoading}
        >
          Select File
        </Button>
      </div>
    </div>
  );
};

export default DropZone;
