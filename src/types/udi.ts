
export interface UDIRecord {
  id: string;
  deviceIdentifier: string;
  manufacturerName: string;
  productName: string;
  modelNumber: string;
  productionDate: string;
  expirationDate: string;
  lotNumber: string;
  serialNumber: string;
  status: 'valid' | 'invalid' | 'warning' | 'pending';
  errors?: string[];
  warnings?: string[];
  isLocked: boolean;
}

export interface UDITableColumn {
  key: keyof UDIRecord;
  label: string;
  editable: boolean;
  required: boolean;
  validator?: (value: string) => { valid: boolean; message?: string };
}
