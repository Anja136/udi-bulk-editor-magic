
import { UDIRecord } from '@/types/udi';

export const validateRequiredField = (value: string) => {
  if (!value || value.trim() === '') {
    return { valid: false, message: 'This field is required' };
  }
  return { valid: true };
};

export const validateDate = (value: string) => {
  if (!value) return { valid: true };
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) {
    return { valid: false, message: 'Date must be in YYYY-MM-DD format' };
  }
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return { valid: false, message: 'Invalid date' };
  }
  
  return { valid: true };
};

export const validateDeviceIdentifier = (value: string) => {
  if (!value) return validateRequiredField(value);
  
  // Simple validation for demonstration - in real applications, you would use
  // the actual UDI validation rules from regulatory bodies
  if (value.length < 5) {
    return { valid: false, message: 'Device identifier must be at least 5 characters' };
  }
  
  return { valid: true };
};

export const validateRecord = (record: UDIRecord): UDIRecord => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required field validation
  if (!record.deviceIdentifier) errors.push('Device Identifier is required');
  if (!record.manufacturerName) errors.push('Manufacturer Name is required');
  if (!record.productName) errors.push('Product Name is required');
  
  // Date validation
  if (record.productionDate) {
    const prodDateValid = validateDate(record.productionDate);
    if (!prodDateValid.valid && prodDateValid.message) errors.push(prodDateValid.message);
  }
  
  if (record.expirationDate) {
    const expDateValid = validateDate(record.expirationDate);
    if (!expDateValid.valid && expDateValid.message) errors.push(expDateValid.message);
    
    // Check if expiration date is after production date
    if (record.productionDate && expDateValid.valid) {
      const prodDate = new Date(record.productionDate);
      const expDate = new Date(record.expirationDate);
      
      if (prodDate > expDate) {
        warnings.push('Expiration date should be after production date');
      }
    }
  }
  
  // Device identifier format (simplified)
  if (record.deviceIdentifier && record.deviceIdentifier.length < 5) {
    errors.push('Device identifier should be at least 5 characters');
  }
  
  // Determine status based on validation results
  let status: UDIRecord['status'] = 'valid';
  if (errors.length > 0) {
    status = 'invalid';
  } else if (warnings.length > 0) {
    status = 'warning';
  }
  
  return {
    ...record,
    errors,
    warnings,
    status
  };
};

export const validateRecords = (records: UDIRecord[]): UDIRecord[] => {
  return records.map(validateRecord);
};
