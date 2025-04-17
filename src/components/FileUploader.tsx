
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileCheck, AlertCircle, History, Eye, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { UDIRecord } from '@/types/udi';
import { useToast } from '@/components/ui/use-toast';
import { generateMockData } from '@/lib/mockData';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { validateRecords } from '@/lib/validators';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onDataLoaded: (data: UDIRecord[]) => void;
  onHistorySelect?: (data: UploadHistory) => void;
}

export interface UploadHistory {
  id: string;
  fileName: string;
  timestamp: Date;
  recordCount: number;
  data: UDIRecord[];
  isValid: boolean;
  invalidCount: number;
  warningCount: number;
}

const FileUploader = ({ onDataLoaded, onHistorySelect }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedRecords, setUploadedRecords] = useState<UDIRecord[]>([]);
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('udiUploadHistory');
    if (savedHistory) {
      try {
        setUploadHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse upload history:', e);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (uploadHistory.length > 0) {
      localStorage.setItem('udiUploadHistory', JSON.stringify(uploadHistory));
    }
  }, [uploadHistory]);

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
    processFile(file);
  };

  const processFile = (fileToProcess = file) => {
    if (!fileToProcess) return;
    
    setIsLoading(true);
    
    // In a real application, you would parse the CSV/Excel file here
    // For demo purposes, we'll simulate file processing with a delay
    setTimeout(() => {
      // Generate mock data instead of actual file parsing
      const mockData = generateMockData(20);
      const validatedData = validateRecords(mockData);
      
      // Add the upload to history
      const invalidCount = validatedData.filter(r => r.status === 'invalid').length;
      const warningCount = validatedData.filter(r => r.status === 'warning').length;
      
      const newHistory: UploadHistory = {
        id: Date.now().toString(),
        fileName: fileToProcess.name,
        timestamp: new Date(),
        recordCount: validatedData.length,
        data: validatedData,
        isValid: invalidCount === 0,
        invalidCount,
        warningCount
      };
      
      setUploadHistory(prev => [newHistory, ...prev].slice(0, 10)); // Keep only the last 10 uploads
      setUploadedRecords(validatedData);
      onDataLoaded(validatedData);
      
      toast({
        title: "File processed successfully",
        description: `Loaded ${validatedData.length} records`,
        variant: "default"
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const loadDemoData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockData = generateMockData(20);
      const validatedData = validateRecords(mockData);
      
      // Add the demo data to history
      const invalidCount = validatedData.filter(r => r.status === 'invalid').length;
      const warningCount = validatedData.filter(r => r.status === 'warning').length;
      
      const newHistory: UploadHistory = {
        id: Date.now().toString(),
        fileName: "Demo Data.csv",
        timestamp: new Date(),
        recordCount: validatedData.length,
        data: validatedData,
        isValid: invalidCount === 0,
        invalidCount,
        warningCount
      };
      
      setUploadHistory(prev => [newHistory, ...prev].slice(0, 10)); // Keep only the last 10 uploads
      setUploadedRecords(validatedData);
      onDataLoaded(validatedData);
      
      toast({
        title: "Demo data loaded",
        description: `Loaded ${validatedData.length} demo records`,
        variant: "default"
      });
      
      setIsLoading(false);
    }, 500);
  };

  const viewHistoryItem = (item: UploadHistory) => {
    if (onHistorySelect) {
      onHistorySelect(item);
    }
  };

  // Render Data Validation Summary
  const renderDataValidationSummary = (records: UDIRecord[]) => {
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

        {uploadedRecords.length > 0 && (
          <div className="mt-4">
            {renderDataValidationSummary(uploadedRecords)}
          </div>
        )}

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
              onClick={() => processFile()}
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

        {/* Upload History Section */}
        {uploadHistory.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center mb-3">
              <History className="mr-2 h-4 w-4" />
              <h3 className="text-sm font-medium">Upload History</h3>
            </div>
            <ScrollArea className="h-[200px] rounded-md border">
              {uploadHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border-b hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => viewHistoryItem(item)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.invalidCount > 0 ? 'bg-error' :
                      item.warningCount > 0 ? 'bg-warning' : 'bg-success'
                    }`} />
                    <div>
                      <div className="font-medium">{item.fileName}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-xs mr-3">
                      <div>{item.recordCount} records</div>
                      {item.invalidCount > 0 && (
                        <div className="text-error">{item.invalidCount} errors</div>
                      )}
                      {item.warningCount > 0 && (
                        <div className="text-warning">{item.warningCount} warnings</div>
                      )}
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploader;
