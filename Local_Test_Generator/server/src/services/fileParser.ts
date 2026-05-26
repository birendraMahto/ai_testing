// File parser service — extracts text from uploaded files

import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { UploadedFile } from '../types';

export async function parseFile(filePath: string, originalName: string, mimeType: string): Promise<UploadedFile> {
  const ext = path.extname(originalName).toLowerCase();
  let extractedText = '';

  try {
    switch (ext) {
      case '.txt':
        extractedText = fs.readFileSync(filePath, 'utf-8');
        break;

      case '.pdf':
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        extractedText = pdfData.text;
        break;

      case '.docx':
        const docxResult = await mammoth.extractRawText({ path: filePath });
        extractedText = docxResult.value;
        break;

      case '.xlsx':
      case '.xls':
        const workbook = XLSX.readFile(filePath);
        const sheetNames = workbook.SheetNames;
        extractedText = sheetNames
          .map(name => {
            const sheet = workbook.Sheets[name];
            return `--- Sheet: ${name} ---\n${XLSX.utils.sheet_to_csv(sheet)}`;
          })
          .join('\n\n');
        break;

      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.webp':
        // For images, we return a note that vision model support is needed
        extractedText = `[Image file uploaded: ${originalName}. Please describe the requirements shown in this image.]`;
        break;

      default:
        // Try to read as plain text
        extractedText = fs.readFileSync(filePath, 'utf-8');
        break;
    }
  } catch (error: any) {
    throw new Error(`Failed to parse file ${originalName}: ${error.message}`);
  }

  const stats = fs.statSync(filePath);

  return {
    originalName,
    extractedText,
    mimeType,
    size: stats.size,
  };
}
