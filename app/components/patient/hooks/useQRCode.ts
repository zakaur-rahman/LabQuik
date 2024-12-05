import { useMemo } from 'react';

const QR_CACHE: { [key: string]: string } = {};

export const useQRCode = (patientId?: string) => {
  return useMemo(() => {
    if (!patientId) return '';

    // Check cache first
    if (QR_CACHE[patientId]) {
      return QR_CACHE[patientId];
    }

    // Generate new QR value and cache it
    const newQrValue = `https://yourlabname.in/patient/${patientId}`;
    QR_CACHE[patientId] = newQrValue;
    return newQrValue;
  }, [patientId]);
}; 