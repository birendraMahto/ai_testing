class ToolService {
  /**
   * Mock fetching a ticket from Jira or ADO.
   * In a real implementation, you would pass the auth token and tool URL here.
   */
  async fetchTicketDetails(ticketId, toolConnection) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!ticketId) {
      throw new Error('Ticket ID is required');
    }

    if (toolConnection && toolConnection.url && toolConnection.url.toLowerCase() !== 'mock') {
      try {
        let cleanTicketId = ticketId.trim();
        
        // If user pasted a full URL in the Ticket ID field, extract the ID
        if (cleanTicketId.includes('http')) {
          try {
             const parsed = new URL(cleanTicketId);
             const pathParts = parsed.pathname.split('/');
             cleanTicketId = pathParts[pathParts.length - 1];
          } catch(e) {}
        }

        let baseToolUrl = toolConnection.url.trim().replace(/\/+$/, '');
        if (!baseToolUrl.startsWith('http')) {
           baseToolUrl = `https://${baseToolUrl}`;
        }
        const isAdo = baseToolUrl.includes('dev.azure.com') || baseToolUrl.includes('visualstudio.com');
        
        let fetchUrl = '';
        let authHeader = '';

        if (isAdo) {
          // ADO Logic
          baseToolUrl = baseToolUrl.replace(/\/_workitems\/?.*$/, '');
          fetchUrl = `${baseToolUrl}/_apis/wit/workitems/${cleanTicketId}?api-version=7.1`;
          authHeader = `Basic ${Buffer.from(`:${toolConnection.token.trim()}`).toString('base64')}`; 
        } else {
          // Jira Logic
          cleanTicketId = cleanTicketId.toUpperCase();
          baseToolUrl = baseToolUrl.replace(/\/browse\/?.*$/, '');
          fetchUrl = `${baseToolUrl}/rest/api/2/issue/${cleanTicketId}`;
          const safeEmail = toolConnection.email ? toolConnection.email.trim() : '';
          const safeToken = toolConnection.token ? toolConnection.token.trim() : '';
          authHeader = `Basic ${Buffer.from(`${safeEmail}:${safeToken}`).toString('base64')}`;
        }
        
        console.log(`[Tool Fetch] Attempting to fetch URL: ${fetchUrl}`);
        console.log(`[Tool Fetch] Using email: ${toolConnection.email}`);
        
        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Accept': 'application/json'
          }
        });

        console.log(`[Tool Fetch] Response status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          let jiraErrorMsg = `${response.statusText}`;
          try {
             const errorData = await response.json();
             if (errorData.errorMessages && errorData.errorMessages.length > 0) {
                 jiraErrorMsg = errorData.errorMessages.join(', ');
             } else if (errorData.message) {
                 jiraErrorMsg = errorData.message;
             }
          } catch(e) {}
          throw new Error(`${isAdo ? 'ADO' : 'Jira'} API returned ${response.status}: ${jiraErrorMsg}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API returned HTML instead of JSON. This usually means your credentials are incorrect.');
        }

        const data = await response.json();
        
        if (isAdo) {
           return {
             id: data.id,
             title: data.fields['System.Title'] || `Ticket ${data.id}`,
             type: data.fields['System.WorkItemType'] || 'Unknown',
             priority: data.fields['Microsoft.VSTS.Common.Priority'] || 'None',
             status: data.fields['System.State'] || 'Unknown',
             assignee: data.fields['System.AssignedTo']?.displayName || 'Unassigned',
             description: data.fields['System.Description'] || 'No description provided.',
             acceptanceCriteria: [], 
             createdAt: data.fields['System.CreatedDate']
           };
        } else {
           return {
             id: data.key,
             title: data.fields.summary || `Ticket ${data.key}`,
             type: data.fields.issuetype?.name || 'Unknown',
             priority: data.fields.priority?.name || 'None',
             status: data.fields.status?.name || 'Unknown',
             assignee: data.fields.assignee?.displayName || 'Unassigned',
             description: data.fields.description || 'No description provided.',
             acceptanceCriteria: [], 
             createdAt: data.fields.created
           };
        }
      } catch (err) {
        console.error('Error fetching from Tool:', err.message);
        throw new Error(`Failed to fetch: ${err.message}. Please check your Tool URL, Email, and API Token.`);
      }
    }

    // Fallback to Mock data if no valid URL provided
    return {
      id: ticketId,
      title: `Feature implementation for ${ticketId}`,
      type: 'Story',
      priority: 'High',
      status: 'In Progress',
      assignee: 'Jane Doe',
      description: `As a user, I want this feature so that I can accomplish my goals.\n\nBackground:\nCurrently the system lacks this capability which is causing friction for our enterprise clients. This epic will address the core infrastructure needed.\n\nRequirements:\n- Must integrate with existing Auth\n- Must handle 10k RPS\n- Must have 99.9% uptime`,
      acceptanceCriteria: [
        "User can successfully authenticate",
        "API handles concurrent requests without dropping",
        "Data is encrypted at rest"
      ],
      createdAt: new Date().toISOString()
    };
  }
}

module.exports = new ToolService();
