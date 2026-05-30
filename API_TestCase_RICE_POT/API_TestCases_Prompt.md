# API Test Case Generation Prompt — Restful Booker API

---

## Role

You are a **QA Automation Tester** with **15 years of experience**. You have strong expertise in **API Testing** and **enterprise-level QA practices**. You need to create comprehensive API test cases for REST-based applications with complete **functional and negative coverage**.

---

## Instructions (I)

Generate a comprehensive set of API test cases for the **Restful Booker API**.

Ensure the test cases cover **all endpoints** including:

| Endpoint Group | Endpoint Name |
|---|---|
| Auth | CreateToken |
| Booking | GetBookingIds |
| Booking | GetBooking |
| Booking | CreateBooking |
| Booking | UpdateBooking |
| Booking | PartialUpdateBooking |
| Booking | DeleteBooking |
| Ping | HealthCheck |

> **[Critical]** Include **positive**  **negative** **Edge/Corner case** and **security** scenarios.

> **[Critical]** Include validations for:
> - Status codes
> - Headers
> - Request Body
> - Response body
> - Authentication token
> - Authorization
> - Invalid data
> - Missing fields
> - Boundary conditions
> - URL Injection

> **[Mandatory]** Ensure test cases follow **enterprise QA standards** with strong functional coverage.

> **[Mandatory]** Generate realistic API testing scenarios including:
> - Authentication validation
> - Invalid payloads
> - Incorrect booking IDs
> - Authorization failures
> - Edge cases
> - Positive case
> - Negative case
> - Security cases

> **[Output]** Output **only** the test cases in **Excel table format** using the following **exact column structure**:

```
Scenario TID | Requirement Id | Test Type | TestCase Description | PreCondition | TestSteps | Expected Result | Actual Result | Steps to Execute | Expected Result | Actual Result | Status | Executed QA Name | Misc (Comments) | Priority | Is Automated | Is Manual
```

> **[Don't]** Do not generate automation scripts or code.

> **[Don't]** Do not include explanations or extra text.

> **[Don't]** Do not change the column structure.

> **[Generate]** Generate **50+ API test cases** covering all endpoints.

Maintain **clear, structured, and enterprise QA-level** test cases suitable for **direct copy-paste into Excel**.

---

## Context (C)

You are creating API test cases for the **Restful Booker API** available at:

🔗 [https://restful-booker.herokuapp.com/apidoc/index.html](https://restful-booker.herokuapp.com/apidoc/index.html)

- The system provides APIs for **authentication**, **booking management**, and **health check**.
- The **Authentication API** generates a token which is **required** for Update and Delete booking operations.

---

## Example (E)

Example row format:

| Field | Value |
|---|---|
| **Scenario TID** | TC_AUTH_001 |
| **Requirement Id | RQ_API_001 |
| **Test Type | Positive
| **TestCase Description** | Verify token generation with valid credentials |
| **PreCondition** | API endpoint is accessible |
| **TestSteps** | Send POST request to `/auth` with valid username and password |
| **Expected Result** | API returns status code 200 and token in response |
| **Actual Result** | *(to be filled after execution)* |
| **Steps to Execute** | Execute POST request via API client |
| **Expected Result** | Token generated successfully |
| **Actual Result** | *(to be filled after execution)* |
| **Status** | Not Executed |
| **Executed QA Name** | *(to be filled)* |
| **Misc (Comments)** | *(optional)* |
| **Priority** | High |
| **Is Automated** | No |

---

## Parameters (P)

> Enterprise-level QA expertise with **complete API test coverage** and **strong edge case scenarios**.

---

## Output (O)

Provide **only** the Excel-ready table rows using the **exact column structure** defined above.

---

## Tone (T)

**Technical, structured, enterprise-grade QA documentation.**

---

## Step-by-Step Process

> **[Important]** Before generating any test cases, follow this step-by-step process and explain each step clearly:

### Step 1 — Plan & Show the Blueprint
- List all **endpoints** to be covered
- Identify the **total number of test cases** planned per endpoint
- Show a **coverage summary table** (Endpoint | Positive TCs | Negative TCs | Total)
- Confirm the **column structure** before proceeding

### Step 2 — Explain What You Are Doing
- Describe what type of scenarios you will cover for each endpoint
- Mention which **validation types** (status code, headers, body, auth, boundary) apply to which endpoints
- Ask for confirmation before proceeding to generation

### Step 3 — Generate Test Cases (Endpoint by Endpoint)
Generate in this sequence:
1. `Auth — CreateToken` (Positive + Negative)
2. `Booking — GetBookingIds` (Positive + Negative)
3. `Booking — GetBooking` (Positive + Negative)
4. `Booking — CreateBooking` (Positive + Negative)
5. `Booking — UpdateBooking` (Positive + Negative)
6. `Booking — PartialUpdateBooking` (Positive + Negative)
7. `Booking — DeleteBooking` (Positive + Negative)
8. `Ping — HealthCheck` (Positive + Negative)

### Step 4 — Final Summary
- Provide a **count of total test cases** generated
- Confirm **all endpoints** are covered
- Confirm **positive and negative** scenarios are both included
