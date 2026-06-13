# Bug Report: Login Error Message

**Bug ID:** BUG-001  
**Date Reported:** 2026-05-31  
**Reported By:** Birendra Mahto  
**Module / Feature:** Login / Authentication

---

**Title:**  
Confusing Error message on failed login with invalid credentials

---

## Environment:
| Field | Value |
|-------|-------|
| Application URL | app.vwo.com |
| Browser | Chrome |
| OS | macOS 26.4.1 |
| Network | Direct connection (No VPN/Proxy) |
| Test Environment | [NEEDS CLARIFICATION — Production / Staging / Dev / QA] |

---

## Severity
[NEEDS CLARIFICATION] — Select One:
- [ ] Critical
- [ ] High
- [x] Medium
- [ ] Low

---

## Issue / Defect Description
When a user navigates to **app.vwo.com** and attempts to log in using **invalid credentials** (both invalid username and invalid password), clicking the **Submit** button displays the following error message:

> **"You are not allowed to log in."**

This message is **misleading and confusing** because it implies the user's account has been **restricted, blocked, or lacks permission** to access the application — rather than simply indicating that the credentials entered are incorrect.

**Why this is a defect:**
- The error message does not accurately describe the root cause (invalid credentials).
- It may cause unnecessary confusion, leading users to contact support thinking their account is blocked.
- Industry best practice recommends a generic, non-revealing message such as **"Invalid Username or Password"** to avoid credential enumeration attacks.

---

## Pre-Conditions
1. The app.vwo.com login page is accessible and fully loaded.
2. The user does NOT have valid credentials to enter.

---

## Steps to Reproduce:
1. Navigate to **app.vwo.com**.
2. Enter an **invalid username** in the username field.
3. Enter an **invalid password** in the password field.
4. Click on the **Submit** button.

*(Note: A "Remember me" button and social login options are also visible on this page).*

---

## Expected Result:
The application should display a clear, user-friendly error message such as:
> **"Invalid Username or Password"**

---

## Actual Result:
An error message is displayed stating:
> **"You are not allowed to log in."**

---

## Evidence Required:
| Evidence Type | Status |
|---------------|--------|
| Screenshot | [NEEDS TO BE ATTACHED] |
| Screen Recording | [NEEDS TO BE ATTACHED] |
| Console Logs | [NEEDS CLARIFICATION] |
| Network Logs (HAR) | [NEEDS CLARIFICATION] |

---

## Additional Information
*(Fill in the sections below if applicable / as required)*

**Reproducibility:**
| Field | Value |
|-------|-------|
| Frequency | [NEEDS CLARIFICATION — Always / Intermittent / Once] |
| Reproducible | [NEEDS CLARIFICATION — Yes / No] |

**UI Observations on Login Page:**
| UI Element | Present | Notes |
|------------|---------|-------|
| Submit Button | ✅ Yes | Triggers the login action |
| Remember Me Button | ✅ Yes | Checkbox available on login page |
| Social Logins | ✅ Yes | Social login options are available |

**Impact Analysis:**
- **User Experience:** Users may believe their account is blocked/restricted when it is simply an incorrect credential issue.
- **Security Concern:** The error message should not hint at whether the username exists or the password is wrong. A generic message like "Invalid Username or Password" is the industry best practice to prevent enumeration attacks.

**Related Defects / Linked Issues:**
- [Fill if any related bugs exist]

**Workaround:**
- [Fill if any temporary workaround is available]

**Attachments:**
- [Attach screenshots, recordings, or logs here]

**Notes / Comments:**
- [Add any additional observations, developer notes, or discussion points here]

---

> **Disclaimer:** This bug report was generated based strictly on the informal notes provided. No details were invented. All gaps are marked as `[NEEDS CLARIFICATION]`.

---

## Anti-Hallucination Reminder
⚠️ **IMPORTANT:** When generating bug reports:

✅ **DO:**
- Use only provided evidence
- Mark unknowns explicitly
- Request clarification for gaps

❌ **DO NOT:**
- Assume root cause
- Invent error messages
- Guess system behavior
- Fill gaps with assumptions
