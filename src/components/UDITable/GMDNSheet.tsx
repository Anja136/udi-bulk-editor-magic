
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, X, Edit, Save } from 'lucide-react';
import { UDIRecord, GMDNRecord } from '@/types/udi';
import { v4 as uuidv4 } from 'uuid';

interface GMDNSheetProps {
  records: UDIRecord[];
}

const GMDNSheet = ({ records }: GMDNSheetProps) => {
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
      status: 'pending',
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
          status: 'valid'
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
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
                    onClick={() => setSelectedDevice(record.deviceIdentifier)}
                  >
                    <span className="font-medium">{record.deviceIdentifier}</span>
                    <span className="block text-xs text-muted-foreground">{record.manufacturerName} - {record.productName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">GMDN Codes</h3>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleAddGMDN}
              disabled={!selectedDevice}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add GMDN Code
            </Button>
          </div>
          
          {!selectedDevice ? (
            <div className="border rounded-md p-4 text-center text-muted-foreground">
              Select a device to view or add GMDN codes
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">GMDN Code</TableHead>
                    <TableHead className="w-1/2">GMDN Term</TableHead>
                    <TableHead className="w-1/6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGMDNRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No GMDN codes associated with this device
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGMDNRecords.map(record => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {editingRecord === record.id ? (
                            <Input 
                              value={editCode} 
                              onChange={(e) => setEditCode(e.target.value)} 
                              placeholder="Enter GMDN code"
                              className="h-8"
                            />
                          ) : (
                            record.gmdnCode
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRecord === record.id ? (
                            <Input 
                              value={editTerm} 
                              onChange={(e) => setEditTerm(e.target.value)} 
                              placeholder="Enter GMDN term"
                              className="h-8"
                            />
                          ) : (
                            record.gmdnTerm
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingRecord === record.id ? (
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" onClick={handleSaveGMDN} title="Save">
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={cancelEditing} title="Cancel">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" onClick={() => handleEditGMDN(record)} title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDeleteGMDN(record.id)} title="Delete">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GMDNSheet;
