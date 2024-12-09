import { pdf, Document, Page } from '@react-pdf/renderer';
import React from 'react';
import TestReportPDF from '../Sample';

interface ReportOptions {
  showHeaderFooter?: boolean;
  reportType?: 'single' | 'combined';
  selectedTests?: string[];
}

export const generatePDF = async (reportData: any, options: ReportOptions = {}) => {
  const { showHeaderFooter = true, reportType = 'single', selectedTests } = options;
  
  const processedData = selectedTests ? {
    ...reportData,
    tests: reportData.tests.filter((test: any) => selectedTests.includes(test.testName))
  } : reportData;

  return await pdf(
    React.createElement(Document, {},
      React.createElement(Page, {},
        React.createElement(TestReportPDF, {
          reportData: processedData,
          showHeaderFooter,
          reportType
        })
      )
    )
  ).toBlob();
};

export const downloadReport = async (reportData: any, options: ReportOptions = {}) => {
  const blob = await generatePDF(reportData, options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${reportData.patientId}-${options.reportType || 'single'}-report.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

export const printReport = async (reportData: any, options: ReportOptions = {}) => {
  const blob = await generatePDF(reportData, options);
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(url);
    }, 100);
  };
};

export const sendReport = async (reportData: any, options: ReportOptions = {}) => {
  const blob = await generatePDF(reportData, options);
  return blob; // Return blob for further processing (e.g., API upload)
};