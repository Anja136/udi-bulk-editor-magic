
import React from 'react';
import { UDIRecord } from '@/types/udi';

interface GMDNSheetDeviceSelectorProps {
  records: UDIRecord[];
  selectedDevice: string | null;
  onSelectDevice: (deviceId: string) => void;
}

const GMDNSheetDeviceSelector: React.FC<GMDNSheetDeviceSelectorProps> = ({
  records,
  selectedDevice,
  onSelectDevice
}) => {
  return (
    <div className="md:w-1/3 space-y-2">
      <h3 className="text-sm font-medium">Select Device</h3>
      <div className="border rounded-md p-2 max-h-[300px] overflow-y-auto">
        {records.length === 0 ? (
          <p className="text-sm text-muted-foreground p-2">No devices available</p>
        ) : (
          <ul className="space-y-1">
            {records.map(record => (
              <li 
                key={record.id}
                className={`text-sm p-2 rounded-md cursor-pointer hover:bg-muted ${
                  selectedDevice === record.deviceIdentifier ? 'bg-muted' : ''
                }`}
                onClick={() => onSelectDevice(record.deviceIdentifier)}
              >
                <span className="font-medium">{record.deviceIdentifier}</span>
                <span className="block text-xs text-muted-foreground">{record.manufacturerName} - {record.productName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GMDNSheetDeviceSelector;
