
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFileUpload } from '@/hooks/useFileUpload';
import DropZone from './DropZone';
import FileInfo from './FileInfo';
import ValidationSummary from './ValidationSummary';
import UploadHistoryList from './UploadHistory';
import FileUploaderFooter from './FileUploaderFooter';
import { FileUploaderProps } from './types';

const FileUploader = ({ onDataLoaded, onHistorySelect }: FileUploaderProps) => {
  const {
    isDragging,
    file,
    isLoading,
    uploadedRecords,
    uploadHistory,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    processFile,
    loadDemoData,
    viewHistoryItem
  } = useFileUpload({ onDataLoaded, onHistorySelect });

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <DropZone
          isDragging={isDragging}
          isLoading={isLoading}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileSelect={handleFileChange}
        />

        {uploadedRecords.length > 0 && (
          <div className="mt-4">
            <ValidationSummary records={uploadedRecords} />
          </div>
        )}

        {file && (
          <FileInfo
            file={file}
            isLoading={isLoading}
            onProcess={() => processFile()}
          />
        )}

        <FileUploaderFooter
          isLoading={isLoading}
          onLoadDemoData={loadDemoData}
        />

        <UploadHistoryList
          history={uploadHistory}
          onViewHistoryItem={viewHistoryItem}
        />
      </CardContent>
    </Card>
  );
};

export default FileUploader;
