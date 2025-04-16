
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';
import { UDIRecord } from '@/types/udi';
import { useToast } from '@/components/ui/use-toast';
import { generateMockData } from '@/lib/mockData';

interface FileUploaderProps {
  onDataLoaded: (data: UDIRecord[]) => void;
}

const FileUploader = ({ onDataLoaded }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType !== 'csv' && fileType !== 'xlsx' && fileType !== 'xls') {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV or Excel file",
        variant: "destructive"
      });
      return;
    }
    
    setFile(file);
  };

  const processFile = () => {
    if (!file) return;
    
    setIsLoading(true);
    
    // In a real application, you would parse the CSV/Excel file here
    // For demo purposes, we'll simulate file processing with a delay
    setTimeout(() => {
      // Generate mock data instead of actual file parsing
      const mockData = generateMockData(20);
      onDataLoaded(mockData);
      
      toast({
        title: "File processed successfully",
        description: `Loaded ${mockData.length} records`,
        variant: "default"
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const loadDemoData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockData = generateMockData(20);
      onDataLoaded(mockData);
      
      toast({
        title: "Demo data loaded",
        description: `Loaded ${mockData.length} demo records`,
        variant: "default"
      });
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
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
              onChange={handleFileChange}
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

        {file && (
          <div className="mt-4 flex items-center justify-between rounded border p-3">
            <div className="flex items-center space-x-2">
              <FileCheck className="h-5 w-5 text-primary" />
              <span className="font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            <Button
              onClick={processFile}
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? "Processing..." : "Process File"}
            </Button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center text-sm">
            <AlertCircle className="mr-1 h-4 w-4 text-warning" />
            <span>Supported formats: CSV, XLSX, XLS</span>
          </div>
          <Button variant="link" onClick={loadDemoData} disabled={isLoading}>
            Load Demo Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
