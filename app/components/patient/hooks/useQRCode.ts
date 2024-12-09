import { useMemo } from 'react';
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import ReactDOMServer from 'react-dom/server';

const QR_CACHE: Record<string, string> = {};
const QR_SVG_CACHE: Record<string, string> = {};

export const useQRCode = (patientId?: string) => {
  // Generate the QR code value (URL) and cache it
  const qrValue = useMemo(() => {
    if (!patientId) return '';
    if (!QR_CACHE[patientId]) {
      QR_CACHE[patientId] = `https://yourlabname.in/patient/${patientId}`;
    }
    return QR_CACHE[patientId];
  }, [patientId]);

  // Generate SVG string
  const getQRSvg = useMemo(() => {
    if (!patientId) return '';
    if (QR_SVG_CACHE[patientId]) return QR_SVG_CACHE[patientId];

    const qrElement = React.createElement(QRCodeSVG, {
      value: qrValue,
      size: 96,
      level: "H",
      bgColor: "#FFFFFF",
      fgColor: "#000000"
    });

    const svgString = ReactDOMServer.renderToString(qrElement);
    QR_SVG_CACHE[patientId] = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    return QR_SVG_CACHE[patientId];
  }, [patientId, qrValue]);

  return {
    qrValue,
    qrSvg: getQRSvg
  };
};
