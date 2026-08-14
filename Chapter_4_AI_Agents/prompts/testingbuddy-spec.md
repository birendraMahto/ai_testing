# TestingBuddy.ai — Final Build Spec & Details

Build a web app called **TestingBuddy.ai**. Reference design images (in `/design`): `toolConnection.jpg`, `llmconnection.jpg`, `Testplan.jpg`, `home.jpg`.

## 1. Global Layout
- **Header**: Light slate-blue background, dark/light mode toggle + Login button (top-right). Removed "Dashboard" text for a cleaner look.
- **Left sidebar** (persistent, white background):
  - Top: Image logo (`logo.jpg`) with "TestingBuddy.AI".
  - Nav buttons: Test Strategy, Test Plan, Defect Report, Test Cases, Release Note
    - Each of these 5 buttons uses a distinct pastel background color and matching border/text when not selected, and flips to a solid primary background when selected.
  - Bottom: Settings button (styled in slate gray), then two status indicators: **Tool Status**, **LLM Status** (each red/green).

## 2. Gating Rule (applies globally)
Test Strategy, Test Plan, Defect Report, Test Cases, Release Note are usable **only if both Tool Status AND LLM Status are green**.
If either is red and the user clicks any of these 5 nav items: open that item's page in the center panel, but show only a blocking message: "Set up a test management tool (Jira, ADO, etc.) and connect an LLM before continuing" + a "Home" button + "Go to Settings" button. No functional UI for that page renders until both are green.

## 3. Home Page (center panel)
- Matches exactly with the `home.jpg` design.
- **Hero Section**: "Smarter Testing. Faster Releases. Better Quality." with a "Get Started" (purple) button and a disabled "Learn More" button.
- **Feature Cards**: 5 distinct horizontal cards matching the navigation buttons (Strategy, Planning, Defect, Cases, Release).
- **Stats Banner**: A purple footer gradient displaying statistics (10x, 95%, 70%, 100%).

## 4. Settings Page
Opens in center panel. Top tabs: **Test Management Tool** | **LLM Connection**

### 4a. Test Management Tool tab
- Sub-buttons: Add Connection, Saved Connection
- Add Connection form (right pane): **Connection Name**, URL, Email, API Token + buttons: Test Connection, Save Connection, Reset, Cancel
- Saved Connections list displays all saved configurations with an Edit button.
- Logic:
  - Test Connection → attempts connection; on success show "Test connection successful" and enable Save Connection; on failure show error, keep Save disabled
  - Save Connection → persist; reject duplicate connections
  - Sidebar **Tool Status** = green only if at least one connection is saved and its last test was successful; otherwise red

### 4b. LLM Connection tab
- Sub-buttons: Scan Local LLM, Saved Connection
- Two inner tabs: **Local LLM Setup** | **Remote LLM Setup**
  - Local: Connection Name, Select LLM (dropdown populated dynamically from installed tools like Ollama), Select/Enter Model Name (dropdown populated dynamically based on selected Local LLM).
  - Remote: Connection Name, LLM Name, Model Name, API Token.
- Shared buttons (both tabs): Test Connection, Save Connection, Reset, Cancel.
- Logic: same pattern as 4a.

## 5. Artifact Generation Pages (Test Strategy, Test Plan, Defect Report, Test Cases, Release Note)
- **Ticket Details:** Entering a Jira ID and clicking Fetch Details will call the backend to retrieve actual Jira fields (Summary, Description, Assignee, Status) and present them in a scrollable view.
- **Generation Options:** Section with checkboxes for various parameters (e.g. Include Test Cases, Functional Tests, etc.).
- **Generate:** Clicking Generate talks to the configured LLM engine and returns a fully detailed Markdown response.
- **Preview & Download:** After successful generation, the UI provides **separate** buttons for Preview and Download.
  - Preview [Document]: Opens a sleek modal overlay with the rendered Markdown.
  - Download [Document]: Immediately exports the generated content as a file (Word/PDF/CSV/Excel depending on the document type).
