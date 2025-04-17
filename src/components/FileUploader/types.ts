
import { UDIRecord } from '@/types/udi';

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

export interface FileUploaderProps {
  onDataLoaded: (data: UDIRecord[]) => void;
  onHistorySelect?: (data: UploadHistory) => void;
}
