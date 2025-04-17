
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadHistory as UploadHistoryType } from './types';

interface UploadHistoryListProps {
  history: UploadHistoryType[];
  onViewHistoryItem: (item: UploadHistoryType) => void;
}

const UploadHistoryList = ({ history, onViewHistoryItem }: UploadHistoryListProps) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center mb-3">
        <History className="mr-2 h-4 w-4" />
        <h3 className="text-sm font-medium">Upload History</h3>
      </div>
      <ScrollArea className="h-[200px] rounded-md border">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 border-b hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => onViewHistoryItem(item)}
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
  );
};

export default UploadHistoryList;
