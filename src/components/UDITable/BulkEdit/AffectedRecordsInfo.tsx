
import React from 'react';
import { UDIRecord } from '@/types/udi';

interface AffectedRecordsInfoProps {
  filteredRecords: UDIRecord[];
}

const AffectedRecordsInfo = ({ filteredRecords }: AffectedRecordsInfoProps) => {
  const getAffectedRecordsCount = () => {
    const unlocked = filteredRecords.filter(record => !record.isLocked).length;
    return `${unlocked} of ${filteredRecords.length} records will be updated (${filteredRecords.length - unlocked} are locked)`;
  };
  
  if (filteredRecords.length === 0) return null;
  
  return (
    <div className="text-xs text-muted-foreground mt-2">
      {getAffectedRecordsCount()}
    </div>
  );
};

export default AffectedRecordsInfo;
