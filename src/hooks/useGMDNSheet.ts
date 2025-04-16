
import { useState } from 'react';
import { UDIRecord, GMDNRecord } from '@/types/udi';
import { v4 as uuidv4 } from 'uuid';

export const useGMDNSheet = (records: UDIRecord[]) => {
  const [gmdnRecords, setGmdnRecords] = useState<GMDNRecord[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editTerm, setEditTerm] = useState('');

  // Filter GMDN records for the selected device
  const filteredGMDNRecords = gmdnRecords.filter(
    record => record.deviceIdentifier === selectedDevice
  );

  const handleAddGMDN = () => {
    if (!selectedDevice) return;
    
    const newRecord: GMDNRecord = {
      id: uuidv4(),
      deviceIdentifier: selectedDevice,
      gmdnCode: '',
      gmdnTerm: '',
      status: 'pending' as const,
      isLocked: false
    };
    
    setGmdnRecords([...gmdnRecords, newRecord]);
    setEditingRecord(newRecord.id);
    setEditCode('');
    setEditTerm('');
  };

  const handleSaveGMDN = () => {
    if (!editingRecord) return;
    
    const updatedRecords = gmdnRecords.map(record => {
      if (record.id === editingRecord) {
        return {
          ...record,
          gmdnCode: editCode,
          gmdnTerm: editTerm,
          status: 'valid' as const
        };
      }
      return record;
    });
    
    setGmdnRecords(updatedRecords);
    setEditingRecord(null);
  };

  const handleEditGMDN = (record: GMDNRecord) => {
    setEditingRecord(record.id);
    setEditCode(record.gmdnCode);
    setEditTerm(record.gmdnTerm);
  };

  const handleDeleteGMDN = (recordId: string) => {
    setGmdnRecords(gmdnRecords.filter(record => record.id !== recordId));
  };

  const cancelEditing = () => {
    setEditingRecord(null);
  };

  return {
    gmdnRecords,
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
  };
};
