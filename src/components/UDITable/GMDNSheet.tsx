
import React from 'react';
import { UDIRecord } from '@/types/udi';
import GMDNSheetDeviceSelector from './GMDNSheetDeviceSelector';
import GMDNSheetTable from './GMDNSheetTable';
import { useGMDNSheet } from '@/hooks/useGMDNSheet';

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
      <div className="flex flex-col md:flex-row gap-4">
        <GMDNSheetDeviceSelector
          records={records}
          selectedDevice={selectedDevice}
          onSelectDevice={setSelectedDevice}
        />
        
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
      </div>
    </div>
  );
};

export default GMDNSheet;
