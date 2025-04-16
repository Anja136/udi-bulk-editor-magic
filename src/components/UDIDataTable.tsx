
import { useState, useEffect } from 'react';
import { UDIRecord, UDITableColumn } from '@/types/udi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Save, Lock, Unlock, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { validateRecord } from '@/lib/validators';

interface UDIDataTableProps {
  data: UDIRecord[];
  onDataChange: (data: UDIRecord[]) => void;
}

const UDIDataTable = ({ data, onDataChange }: UDIDataTableProps) => {
  const [records, setRecords] = useState<UDIRecord[]>([]);
  const [editingCell, setEditingCell] = useState<{ rowId: string; column: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    setRecords(data);
  }, [data]);

  const columns: UDITableColumn[] = [
    { key: 'deviceIdentifier', label: 'Device Identifier', editable: true, required: true },
    { key: 'manufacturerName', label: 'Manufacturer', editable: true, required: true },
    { key: 'productName', label: 'Product', editable: true, required: true },
    { key: 'modelNumber', label: 'Model #', editable: true, required: false },
    { key: 'productionDate', label: 'Production Date', editable: true, required: false },
    { key: 'expirationDate', label: 'Expiration Date', editable: true, required: false },
    { key: 'lotNumber', label: 'Lot #', editable: true, required: false },
    { key: 'serialNumber', label: 'Serial #', editable: true, required: false },
    { key: 'status', label: 'Status', editable: false, required: false },
  ];

  const startEditing = (record: UDIRecord, column: string) => {
    if (record.isLocked) return;
    
    setEditingCell({ rowId: record.id, column });
    setEditValue(record[column as keyof UDIRecord]?.toString() || '');
  };

  const handleSave = () => {
    if (!editingCell) return;
    
    const { rowId, column } = editingCell;
    const updatedRecords = records.map(record => {
      if (record.id === rowId) {
        const updatedRecord = {
          ...record,
          [column]: editValue
        };
        return validateRecord(updatedRecord);
      }
      return record;
    });
    
    setRecords(updatedRecords);
    onDataChange(updatedRecords);
    setEditingCell(null);
  };

  const cancelEditing = () => {
    setEditingCell(null);
  };

  const toggleLock = (id: string) => {
    const updatedRecords = records.map(record => {
      if (record.id === id) {
        return { ...record, isLocked: !record.isLocked };
      }
      return record;
    });
    
    setRecords(updatedRecords);
    onDataChange(updatedRecords);
  };

  const getStatusIcon = (status: UDIRecord['status']) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-error" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (record: UDIRecord) => {
    const { status, errors, warnings } = record;
    
    let badgeContent;
    switch (status) {
      case 'valid':
        badgeContent = (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Valid
          </Badge>
        );
        break;
      case 'warning':
        badgeContent = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Warning
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  {warnings?.map((warning, idx) => (
                    <div key={idx} className="text-xs">{warning}</div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
        break;
      case 'invalid':
        badgeContent = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-error/10 text-error border-error/20">
                  <AlertCircle className="h-3 w-3 mr-1" /> Invalid
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  {errors?.map((error, idx) => (
                    <div key={idx} className="text-xs">{error}</div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
        break;
      default:
        badgeContent = (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            Pending
          </Badge>
        );
    }
    
    return badgeContent;
  };

  return (
    <div className="w-full overflow-auto">
      <Table className="min-w-full">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-12 text-center">Actions</TableHead>
            {columns.map((column) => (
              <TableHead key={column.key}>
                {column.label}
                {column.required && <span className="text-error"> *</span>}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center py-8">
                No data available. Upload a file or load demo data to get started.
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id} className={record.status === 'invalid' ? 'bg-error/5' : record.status === 'warning' ? 'bg-warning/5' : ''}>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleLock(record.id)}
                    className={record.isLocked ? 'text-muted-foreground' : 'text-primary'}
                    title={record.isLocked ? "Unlock to edit" : "Lock editing"}
                  >
                    {record.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                </TableCell>
                
                {columns.map((column) => (
                  <TableCell key={`${record.id}-${column.key}`} className="relative">
                    {editingCell && editingCell.rowId === record.id && editingCell.column === column.key ? (
                      <div className="flex items-center space-x-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8 w-full"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                        <Button variant="ghost" size="icon" onClick={handleSave} title="Save">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={cancelEditing} title="Cancel">
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className={`flex items-center ${column.editable && !record.isLocked ? 'cursor-pointer hover:bg-secondary/50 p-1 rounded transition-colors' : ''}`}
                        onClick={() => column.editable && startEditing(record, column.key)}
                      >
                        {column.key === 'status' ? (
                          getStatusBadge(record)
                        ) : (
                          <div className="flex items-center w-full">
                            <span className="truncate">
                              {String(record[column.key as keyof UDIRecord] || '')}
                            </span>
                            {column.editable && !record.isLocked && (
                              <Edit className="h-3 w-3 ml-1 text-muted-foreground opacity-50" />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UDIDataTable;
