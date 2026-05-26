// Export service — generates CSV and Excel files from test cases

import { TestCase } from '../types';
import ExcelJS from 'exceljs';

export function testCasesToCSV(testCases: TestCase[]): string {
  const headers = [
    'Test Case ID',
    'Test Type',
    'Category',
    'Summary',
    'Preconditions',
    'Steps',
    'Test Data',
    'Expected Result',
    'Priority',
    'Severity',
  ];

  const escapeCSV = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const rows = testCases.map(tc => [
    tc.testCaseId,
    tc.testType,
    tc.category,
    tc.summary,
    tc.preconditions,
    tc.steps,
    tc.testData,
    tc.expectedResult,
    tc.priority,
    tc.severity,
  ].map(escapeCSV).join(','));

  return [headers.join(','), ...rows].join('\n');
}

export async function testCasesToExcel(testCases: TestCase[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Test Cases');

  // Define columns
  sheet.columns = [
    { header: 'Test Case ID', key: 'testCaseId', width: 15 },
    { header: 'Test Type', key: 'testType', width: 15 },
    { header: 'Category', key: 'category', width: 18 },
    { header: 'Summary', key: 'summary', width: 40 },
    { header: 'Preconditions', key: 'preconditions', width: 30 },
    { header: 'Steps', key: 'steps', width: 50 },
    { header: 'Test Data', key: 'testData', width: 30 },
    { header: 'Expected Result', key: 'expectedResult', width: 40 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Severity', key: 'severity', width: 12 },
  ];

  // Style the header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0052CC' }, // Jira blue
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

  // Add data rows
  testCases.forEach(tc => {
    const row = sheet.addRow(tc);
    row.alignment = { vertical: 'top', wrapText: true };
  });

  // Auto-filter
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: testCases.length + 1, column: 10 },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
