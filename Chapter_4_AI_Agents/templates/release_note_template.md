# Release Notes - vX.Y.Z

## 📋 Release Overview
* **Version:** vX.Y.Z
* **Release Date:** DD-MMM-YYYY
* **Environment:** Production / Staging
* **Deployment Lead:** [Name/Team]
* **Git Tag/Commit Hash:** `#a1b2c3d`

---

## 🚀 What’s New? (Feature Enhancements)

| Feature / Module | Description | Required User Action |
| :--- | :--- | :--- |
| **Payment Gateway** | Added UPI auto-pay support for recurring monthly subscriptions. | **Mandatory:** Re-authenticate bank account on first login. |
| **User Profile** | Upgraded profile picture compression algorithm for faster loads. | **Optional:** Re-upload avatar if image appears blurry. |

---

## 🛠️ Bug Fixes

| Issue ID | Component | Description | Impact | Required User Action |
| :--- | :--- | :--- | :--- | :--- |
| `PROJ-1024` | Auth | Fixed session timeout issue on mobile browsers. | High | **Recommended:** Clear browser cache if login loops persist. |
| `PROJ-1105` | Reports | Resolved data mismatch in PDF export for GST reports. | Medium | None. System auto-corrects on next download. |

---

## ⚠️ Known Issues & Limitations
* **Issue:** `PROJ-1301` - Occasional latency on dashboards during high peak hours.
* **Workaround:** Refresh the page or filter by shorter date ranges.
* **Required User Action:** Avoid running bulk report exports between 10 AM and 12 PM IST.

---

## 🔒 Security & Infrastructure Changes
* **Dependencies:** Upgraded `Node.js` from v18 to v20.
* **Security Patch:** Patched CVE-2026-XXXX in logging library.
* **Required User Action:** Third-party API consumers must update their whitelisted IP addresses.

---

## 🧪 Testing Verification Summary
* **Test Automation Pass Rate:** 98.5% 
* **Platforms Verified:** Chrome v140+, Safari v19, Android 14, iOS 17.
* **Performance Metrics:** API response times remained under 200ms.

---

## 📖 Deployment & Rollback Instructions
* **Pre-requisites:** Take full DB backup before executing migration scripts.
* **Deployment Step:** Run `kubectl apply -f deployment-v2.4.0.yaml`.
* **Rollback Plan:** Revert to image tag `v2.3.9` and restore DB snapshot.
