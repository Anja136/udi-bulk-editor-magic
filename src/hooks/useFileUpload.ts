
import { useState, useEffect } from 'react';
import { UDIRecord } from '@/types/udi';
import { useToast } from '@/components/ui/use-toast';
import { generateMockData } from '@/lib/mockData';
import { validateRecords } from '@/lib/validators';
import { UploadHistory } from '@/components/FileUploader/types';

interface UseFileUploadProps {
  onDataLoaded: (data: UDIRecord[]) => void;
  onHistorySelect?: (data: UploadHistory) => void;
}

export const useFileUpload = ({ onDataLoaded, onHistorySelect }: UseFileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedRecords, setUploadedRecords] = useState<UDIRecord[]>([]);
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);
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

  return {
    isDragging,
    file,
    isLoading,
    uploadedRecords,
    uploadHistory,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleFile,
    processFile,
    loadDemoData,
    viewHistoryItem
  };
};
