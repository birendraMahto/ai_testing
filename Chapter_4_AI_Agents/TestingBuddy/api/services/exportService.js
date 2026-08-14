const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const xlsx = require('xlsx');

class ExportService {
  async generateWordDocument(planData) {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: planData.title || 'Generated Test Plan',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Objective:', bold: true }),
              new TextRun(`\n${planData.objective || 'N/A'}`)
            ],
            spacing: { before: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Scope:', bold: true }),
              new TextRun(`\n${planData.scope || 'N/A'}`)
            ],
            spacing: { before: 200 }
          }),
          new Paragraph({
            text: `Generated at: ${planData.generatedAt || new Date().toISOString()}`,
            spacing: { before: 400 }
          })
        ],
      }],
    });

    return await Packer.toBuffer(doc);
  }

  async generateExcelDocument(casesData) {
    const worksheetData = casesData.map((tc, index) => ({
      'Serial No.': index + 1,
      'Test ID': tc.id,
      'Test Description': tc.description,
      'Test Type': tc.type,
      'Test Case Type': tc.category,
      'Pre-Requisites': 'None',
      'Test Execution Steps': '1. Do this\n2. Do that'
    }));

    const worksheet = xlsx.utils.json_to_sheet(worksheetData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Test Cases');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  }
}

module.exports = new ExportService();
