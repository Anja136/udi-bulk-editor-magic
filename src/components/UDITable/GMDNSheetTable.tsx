
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, X, Edit, Save } from 'lucide-react';
import { GMDNRecord } from '@/types/udi';

interface GMDNSheetTableProps {
  selectedDevice: string | null;
  gmdnRecords: GMDNRecord[];
  editingRecord: string | null;
  editCode: string;
  editTerm: string;
  onAddGMDN: () => void;
  onEditGMDN: (record: GMDNRecord) => void;
  onSaveGMDN: () => void;
  onDeleteGMDN: (recordId: string) => void;
  onCancelEditing: () => void;
  onEditCodeChange: (value: string) => void;
  onEditTermChange: (value: string) => void;
}

const GMDNSheetTable: React.FC<GMDNSheetTableProps> = ({
  selectedDevice,
  gmdnRecords,
  editingRecord,
  editCode,
  editTerm,
  onAddGMDN,
  onEditGMDN,
  onSaveGMDN,
  onDeleteGMDN,
  onCancelEditing,
  onEditCodeChange,
  onEditTermChange
}) => {
  return (
    <div className="md:w-2/3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">GMDN Codes</h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onAddGMDN}
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
              {gmdnRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    No GMDN codes associated with this device
                  </TableCell>
                </TableRow>
              ) : (
                gmdnRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {editingRecord === record.id ? (
                        <Input 
                          value={editCode} 
                          onChange={(e) => onEditCodeChange(e.target.value)} 
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
                          onChange={(e) => onEditTermChange(e.target.value)} 
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
                          <Button size="icon" variant="ghost" onClick={onSaveGMDN} title="Save">
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={onCancelEditing} title="Cancel">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => onEditGMDN(record)} title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => onDeleteGMDN(record.id)} title="Delete">
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
  );
};

export default GMDNSheetTable;
