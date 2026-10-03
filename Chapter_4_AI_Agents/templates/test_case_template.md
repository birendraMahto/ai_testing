# Test Case Template

## 📌 Metadata & Traceability

| Field | Description / Value |
| :--- | :--- |
| **Test Case ID** | `TC-XYZ-001` (e.g., `TC-AUTH-042`) |
| **Requirement ID / Jira Story** | `REQ-101` / `PROJ-2048` |
| **Feature / Module Name** | e.g., Authentication -> Multi-Factor Auth (MFA) |
| **Created By / Date** | [Name] / DD-MMM-YYYY |
| **Reviewed By / Date** | [Name] / DD-MMM-YYYY |

---

## ⚙️ Classification & Attributes

| Attribute | Selection (Choose One or More) |
| :--- | :--- |
| **Test Type** | [ ] UI/Frontend | [ ] API/Backend | [ ] Database | [ ] Integration | [ ] Performance |
| **Test Category** | [ ] Sanity | [ ] Smoke | [ ] Regression | [ ] E2E (End-to-End) |
| **Execution Mode** | [ ] Manual Only | [ ] Automated Only | [ ] Hybrid (Manual + Auto) |
| **Automation ID / Script Link** | e.g., `cypress/e2e/auth/mfa_spec.cy.js` (Leave blank if manual) |
| **Test Intent** | [ ] Positive | [ ] Negative | [ ] Edge Case | [ ] Boundary Value (BVA) |
| **Target Environment** | [ ] QA/Staging | [ ] UAT | [ ] Production (Post-Deployment Verification) |

---

## 🧪 Prerequisites & Test Data

*   **Pre-conditions:** 
    1. User is registered and has verified their primary email address.
    2. MFA is enabled on the organizational level but not yet configured for this specific user.
*   **Test Data Requirements:**
    *   `Username`: `test_mfa_user_01@company.com`
    *   `Password`: `ValidSecurePassword123!`
    *   `MFA Secret Seed`: `JBSWY3DPEHPK3PXP` (For generating mock TOTP tokens)

---

## 🏃 Execution Steps & Validation Matrix

| Step # | Action Description | Expected Result | Actual Result (Pass/Fail) | Comments / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Navigate to the login portal URL and enter valid credentials (`Username` & `Password`), then click **Login**. | System authenticates credentials and redirects user to the "Setup MFA QR Code" setup screen. | | |
| **2** | Scan the QR code using a standard authenticator app (Google/Microsoft Auth) and extract the 6-digit TOTP token. | Authenticator app syncs successfully and begins generating rolling 6-digit tokens every 30 seconds. | | |
| **3** | Enter an **expired** or **invalid 6-digit token** (e.g., `000000`) into the input field and click **Verify**. | System rejects the token, displays error message: *"Invalid code. Please try again."*, and prevents dashboard access. | | |
| **4** | Wait for the authenticator app to refresh, enter the **current valid 6-digit token**, and click **Verify**. | System successfully verifies token, redirects user to the landing dashboard, and sets active session cookie. | | |

---

## 📈 Execution Summary & Environment History

| Run # | Executed By | Date | Environment | Build/Version | Status (Pass/Fail/Blocked) | Defect ID (If Failed) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | QA_Eng_1 | 16-Aug-2026 | QA-Env-2 | `v2.4.0-rc3` | **PASS** | N/A |
| **2** | QA_Eng_2 | 17-Aug-2026 | UAT | `v2.4.0-release`| — | — |

---

## 📎 Attachments & References
*   **Figma Wireframe/UI Reference:** `[Link to Design]`
*   **API Swagger Documentation:** `[Link to Swagger Endpoint]`
*   **Log Artifacts / Video Recording:** `[Link to Shared Drive / S3 Bucket for failed runs]`
