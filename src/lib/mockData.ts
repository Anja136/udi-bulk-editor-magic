
import { UDIRecord } from '@/types/udi';
import { v4 as uuidv4 } from 'uuid';

export const generateMockData = (count: number): UDIRecord[] => {
  const manufacturers = ['Medtronic', 'Johnson & Johnson', 'Abbott Laboratories', 'Siemens Healthineers', 'GE Healthcare'];
  const productPrefixes = ['CardioFlow', 'NeuroScan', 'OrthoPro', 'DiabeCare', 'VitaSense'];
  const productSuffixes = ['XL', 'Pro', 'Lite', 'Advanced', 'Plus', 'Mini'];
  
  return Array.from({ length: count }, (_, index) => {
    const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
    const productPrefix = productPrefixes[Math.floor(Math.random() * productPrefixes.length)];
    const productSuffix = productSuffixes[Math.floor(Math.random() * productSuffixes.length)];
    const modelNumber = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 1000)}`;
    
    // Generate random dates
    const today = new Date();
    const productionDate = new Date(today);
    productionDate.setMonth(today.getMonth() - Math.floor(Math.random() * 12));
    
    const expirationDate = new Date(productionDate);
    expirationDate.setFullYear(productionDate.getFullYear() + Math.floor(Math.random() * 5) + 1);
    
    // Create some validation issues for demonstration
    let status: UDIRecord['status'] = 'valid';
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // For some records, create validation issues
    if (index % 7 === 0) {
      status = 'invalid';
      if (index % 2 === 0) {
        errors.push('Invalid device identifier format');
      } else {
        errors.push('Required field missing');
      }
    } else if (index % 5 === 0) {
      status = 'warning';
      if (index % 2 === 0) {
        warnings.push('Expiration date is approaching');
      } else {
        warnings.push('Model number format is non-standard');
      }
    } else if (index % 11 === 0) {
      status = 'invalid';
      errors.push('Manufacturer name does not match registered entries');
      errors.push('Serial number format is invalid');
    }
    
    // Set some records as unlocked for easier testing
    const isLocked = index % 4 !== 0;
    
    return {
      id: uuidv4(),
      deviceIdentifier: `UDI-${(10000 + index).toString()}-${modelNumber}`,
      manufacturerName: index % 13 === 0 ? '' : manufacturer, // Create some empty required fields
      productName: `${productPrefix} ${productSuffix}`,
      modelNumber,
      productionDate: formatDate(productionDate),
      expirationDate: formatDate(expirationDate),
      lotNumber: `LOT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      serialNumber: `SN-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      status,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      isLocked
    };
  });
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
