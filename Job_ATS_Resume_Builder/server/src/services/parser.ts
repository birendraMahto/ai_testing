import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extract text content from a PDF or DOCX file.
 */
export async function parseResume(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    return parsePDF(filePath);
  } else if (ext === '.docx') {
    return parseDOCX(filePath);
  } else {
    throw new Error(`Unsupported file format: ${ext}. Only .pdf and .docx are supported.`);
  }
}

async function parsePDF(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function parseDOCX(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}
