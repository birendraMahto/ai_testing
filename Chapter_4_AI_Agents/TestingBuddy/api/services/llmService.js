const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

class LLMService {
  async generateDocument(ticketDetails, options, llmConnection, documentType, customTemplate) {
    // Map documentType to exact template filename from the user prompt
    const templateMap = {
      'test-strategy': 'test_strategy_template.md',
      'test-plan': 'Test Plan - Template.docx',
      'defect-report': 'defect_report_template.md',
      'test-cases': 'test_case_template.md',
      'release-note': 'release_note_template.md'
    };

    const templateFileName = templateMap[documentType] || 'test_plan_template.md';
    const templatePath = path.join(__dirname, '../../../templates', templateFileName);
    
    let templateContent = '';
    
    if (customTemplate) {
       templateContent = customTemplate;
    } else {
       try {
         if (fs.existsSync(templatePath)) {
           if (templateFileName.endsWith('.docx')) {
              const result = await mammoth.extractRawText({ path: templatePath });
              templateContent = result.value;
           } else {
              templateContent = fs.readFileSync(templatePath, 'utf8');
           }
         } else {
           console.warn(`Template not found at ${templatePath}`);
         }
       } catch (err) {
         console.error('Error reading template:', err);
       }
    }

    const systemPrompt = `You are an expert QA and Testing Assistant. 
Your task is to generate a comprehensive ${documentType.replace('-', ' ')} using the ticket details provided below.

CRITICAL INSTRUCTIONS:
1. You MUST follow the EXACT structure of the "REQUIRED TEMPLATE FORMAT" provided below.
2. DO NOT skip any headings, tables, or sections from the template. Keep every single markdown heading and structure intact.
3. Replace all placeholders (like [Project Name], [Version], etc.) and italicized instructional text with actual, professional content derived from the TICKET DETAILS.
4. If a specific section does not have directly matching information in the ticket, infer reasonable, professional industry-standard defaults based on the ticket context, or mark it as N/A. DO NOT delete the section.
5. Provide your output strictly as the populated markdown document. Do not include introductory or concluding conversational text.

--- TICKET DETAILS ---
ID: ${ticketDetails.id}
Title: ${ticketDetails.title}
Status: ${ticketDetails.status}
Assignee: ${ticketDetails.assignee}
Priority: ${ticketDetails.priority}
Type: ${ticketDetails.type}
Description: ${ticketDetails.description}
Acceptance Criteria: ${ticketDetails.acceptanceCriteria?.join(', ')}

--- REQUIRED TEMPLATE FORMAT ---
${templateContent}
`;

    let generatedMarkdown = '';

    // If an LLM connection is provided, call it
    if (llmConnection && llmConnection.status === 'success') {
      try {
        if (llmConnection.type === 'local') {
          // Ollama Local LLM Call
          const ollamaUrl = llmConnection.url || 'http://localhost:11434';
          const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: llmConnection.modelName,
              prompt: systemPrompt,
              stream: false
            })
          });
          
          if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
          }
          
          const data = await response.json();
          generatedMarkdown = data.response;
        } else {
          // Remote LLM (Placeholder for OpenAI, Anthropic, etc.)
          generatedMarkdown = `# Generated ${documentType}\n\n(Remote LLM logic not yet fully implemented. Prompt would be:\n\n${systemPrompt.substring(0, 200)}...)`;
        }
      } catch (err) {
        console.error('LLM Generation Error:', err);
        generatedMarkdown = `# Error Generating Document\nThere was an error communicating with the LLM. \nError: ${err.message}`;
      }
    } else {
      // Fallback if no LLM is connected, just return a mocked version of the template
      generatedMarkdown = `# Mock Generated ${documentType}\n\n(No LLM Connected. Below is the raw template format)\n\n${templateContent}`;
    }

    let inclusions = {};
    if (options && options.includeTestCases) {
      const inclusionTypes = [];
      if (options.functional) inclusionTypes.push('Functional');
      if (options.regression) inclusionTypes.push('Regression');
      if (options.performance) inclusionTypes.push('Performance');
      if (options.security) inclusionTypes.push('Security');

      let testCaseTemplateContent = '';
      try {
        const tcTemplatePath = path.join(__dirname, '../../../templates', 'test_case_template.md');
        if (fs.existsSync(tcTemplatePath)) {
          testCaseTemplateContent = fs.readFileSync(tcTemplatePath, 'utf8');
        }
      } catch (e) {
        console.error('Error reading test case template:', e);
      }

      for (const incType of inclusionTypes) {
         const incPrompt = `You are an expert QA and Testing Assistant.
Your task is to generate a comprehensive, enterprise-level ${incType} Test Cases document for the provided ticket details.

CRITICAL INSTRUCTIONS:
1. You MUST follow the EXACT structure of the "REQUIRED TEMPLATE FORMAT" provided below.
2. DO NOT skip any headings, tables, or sections from the template. Keep every single markdown heading and structure intact.
3. Replace all placeholders (like [Project Name], [Version], etc.) and italicized instructional text with actual, professional ${incType} test cases derived from the TICKET DETAILS.
4. Ensure the test case table is fully populated with at least 3-5 comprehensive ${incType} test cases.
5. Provide your output strictly as the populated markdown document. Do not include introductory or concluding conversational text.

--- TICKET DETAILS ---
Title: ${ticketDetails.title}
Description: ${ticketDetails.description}
Acceptance Criteria: ${ticketDetails.acceptanceCriteria?.join(', ') || 'N/A'}

--- REQUIRED TEMPLATE FORMAT ---
${testCaseTemplateContent || '| TC ID | Description | Pre-conditions | Steps | Expected Results | Status |\n|---|---|---|---|---|---|'}
`;

         let incMarkdown = '';
         if (llmConnection && llmConnection.status === 'success' && llmConnection.type === 'local') {
           try {
              const ollamaUrl = llmConnection.url || 'http://localhost:11434';
              const response = await fetch(`${ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  model: llmConnection.modelName,
                  prompt: incPrompt,
                  stream: false
                })
              });
              if (!response.ok) throw new Error('API Error');
              const data = await response.json();
              incMarkdown = data.response;
           } catch(e) {
              incMarkdown = `# Error Generating ${incType} Cases\n${e.message}`;
           }
         } else {
            incMarkdown = `# Mock ${incType} Test Cases\n\n| TC ID | Description | Pre-conditions | Steps | Expected Results | Status |\n|---|---|---|---|---|---|\n| TC-${incType}-01 | Verify basic functionality | System is online | 1. Execute function | Function executes successfully | Untested |`;
         }
         inclusions[incType] = incMarkdown;
      }
    }

    return {
      plan: generatedMarkdown,
      inclusions: inclusions
    };
  }
}

module.exports = new LLMService();
