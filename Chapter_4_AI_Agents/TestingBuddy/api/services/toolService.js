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

    if (toolConnection && toolConnection.url && toolConnection.url.includes('http')) {
      try {
        const parsedUrl = new URL(toolConnection.url);
        const baseUrl = parsedUrl.origin;
        // Use API v2 so description is a plain string/markdown rather than ADF JSON
        const url = `${baseUrl}/rest/api/2/issue/${ticketId}`;
        const authHeader = `Basic ${Buffer.from(`${toolConnection.email}:${toolConnection.token}`).toString('base64')}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Jira API returned ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Jira returned HTML instead of JSON. This usually means your Email or API Token is incorrect, causing a redirect to the login page.');
        }

        const data = await response.json();
        
        return {
          id: data.key,
          title: data.fields.summary || `Ticket ${data.key}`,
          type: data.fields.issuetype?.name || 'Unknown',
          priority: data.fields.priority?.name || 'None',
          status: data.fields.status?.name || 'Unknown',
          assignee: data.fields.assignee?.displayName || 'Unassigned',
          description: data.fields.description || 'No description provided.',
          acceptanceCriteria: [], // Custom field in Jira, difficult to map generically without knowing the custom field ID
          createdAt: data.fields.created
        };
      } catch (err) {
        console.error('Error fetching from Jira:', err.message);
        throw new Error(`Failed to fetch from Jira: ${err.message}. Please check your Tool URL, Email, and API Token.`);
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
