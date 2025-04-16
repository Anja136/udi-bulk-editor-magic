
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
  singleUse: boolean;
  sterilized: boolean;
  containsLatex: boolean;
  containsPhthalate: boolean;
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
  frozen?: boolean;
  width?: string;
  type?: 'text' | 'boolean' | 'date';
  validator?: (value: string) => { valid: boolean; message?: string };
}

export interface GMDNRecord {
  id: string;
  deviceIdentifier: string;
  gmdnCode: string;
  gmdnTerm: string;
  status: 'valid' | 'invalid' | 'warning' | 'pending';
  isLocked: boolean;
}

export type SheetType = 'basic' | 'gmdn' | 'custom';

export interface DataSheet {
  id: string;
  name: string;
  type: SheetType;
  icon?: React.ReactNode;
}
