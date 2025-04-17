
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Clock, Eye, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadHistory as UploadHistoryType } from './types';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
        {history.map((item) => {
          // Calculate validation percentages for the progress bar
          const validRecords = item.recordCount - item.invalidCount - item.warningCount;
          const validPercentage = (validRecords / item.recordCount) * 100;
          const warningPercentage = (item.warningCount / item.recordCount) * 100;
          const errorPercentage = (item.invalidCount / item.recordCount) * 100;
          
          return (
            <div
              key={item.id}
              className="border-b hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div 
                className="flex items-center justify-between p-3"
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
              
              {/* Validation Summary - Similar to Data Editor Area */}
              <div className="px-3 pb-3">
                <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
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
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center justify-center p-1 rounded-sm bg-success/10">
                    <CheckCircle className="h-3 w-3 mr-1 text-success" />
                    <span className="text-success">{validRecords} Valid</span>
                  </div>
                  
                  <div className="flex items-center justify-center p-1 rounded-sm bg-warning/10">
                    <AlertTriangle className="h-3 w-3 mr-1 text-warning" />
                    <span className="text-warning">{item.warningCount} Warnings</span>
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center p-1 rounded-sm bg-error/10">
                          <AlertCircle className="h-3 w-3 mr-1 text-error" />
                          <span className="text-error">{item.invalidCount} Errors</span>
                        </div>
                      </TooltipTrigger>
                      {item.invalidCount > 0 && (
                        <TooltipContent className="bg-error/10 border-error">
                          <div className="max-w-xs">
                            <div className="text-sm font-medium mb-1">Error Examples:</div>
                            <div className="max-h-32 overflow-y-auto">
                              {item.data
                                .filter(record => record.status === 'invalid')
                                .slice(0, 2) // Show up to 2 records with errors
                                .map((record, idx) => (
                                  <div key={idx} className="mb-2">
                                    <div className="text-xs font-medium">{record.deviceIdentifier} - {record.productName}</div>
                                    {record.errors && (
                                      <ul className="text-xs list-disc ml-4">
                                        {(record.errors || []).slice(0, 2).map((err, errIdx) => (
                                          <li key={errIdx}>{err}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default UploadHistoryList;
