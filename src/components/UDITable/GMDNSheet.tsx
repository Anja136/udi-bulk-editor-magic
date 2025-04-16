
import React from 'react';
import { UDIRecord } from '@/types/udi';
import GMDNSheetDeviceSelector from './GMDNSheetDeviceSelector';
import GMDNSheetTable from './GMDNSheetTable';
import { useGMDNSheet } from '@/hooks/useGMDNSheet';
import { ScrollArea } from "@/components/ui/scroll-area";

interface GMDNSheetProps {
  records: UDIRecord[];
}

const GMDNSheet: React.FC<GMDNSheetProps> = ({ records }) => {
  const {
    filteredGMDNRecords,
    selectedDevice,
    editingRecord,
    editCode,
    editTerm,
    setSelectedDevice,
    handleAddGMDN,
    handleSaveGMDN,
    handleEditGMDN,
    handleDeleteGMDN,
    setEditCode,
    setEditTerm,
    cancelEditing
  } = useGMDNSheet(records);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <GMDNSheetDeviceSelector
          records={records}
          selectedDevice={selectedDevice}
          onSelectDevice={setSelectedDevice}
        />
        
        <div className="border rounded-md overflow-hidden">
          <div className="h-[calc(100vh-380px)] relative">
            <ScrollArea className="h-full" scrollHide={false} orientation="both">
              <GMDNSheetTable
                selectedDevice={selectedDevice}
                gmdnRecords={filteredGMDNRecords}
                editingRecord={editingRecord}
                editCode={editCode}
                editTerm={editTerm}
                onAddGMDN={handleAddGMDN}
                onEditGMDN={handleEditGMDN}
                onSaveGMDN={handleSaveGMDN}
                onDeleteGMDN={handleDeleteGMDN}
                onCancelEditing={cancelEditing}
                onEditCodeChange={setEditCode}
                onEditTermChange={setEditTerm}
              />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GMDNSheet;
