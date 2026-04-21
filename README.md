# 🧬 Protein Explorer

A high-assurance bioinformatics web application designed to translate complex biological data from the **European Bioinformatics Institute (EBI)** into a user-friendly, interactive 3D dashboard. 

This tool serves as a "Data Translator" for researchers and students, providing immediate visual and structural insights into protein sequences based on strict gene identity.

---

## 🚀 Live Demo
**https://protein-explorer-i3k6.onrender.com/**

*(Note: This application is hosted on a free cloud tier. If it has been inactive for a while, please allow up to 50 seconds for the server to "wake up" on your first search.)*

---

## ✨ Core Features

* **Interactive 3D WebGL Rendering:** Uses Three.js to generate a procedural "Ball-and-Stick" model of the protein. The visualization uses biological CPK standards (Carbon=Grey, Oxygen=Red, Nitrogen=Blue) and features full orbit controls (drag to rotate, scroll to zoom).
* **Strict Identity Matching Gate:** Prevents "fuzzy" or partial matches. The backend system ensures 100% data accuracy by validating user input against official EBI gene nomenclature before rendering.
* **Dual-View UI:** * **Dashboard View:** A data-rich experience featuring the interactive 3D model and sequence data.
    * **Minimalist View:** A high-contrast table optimized for rapid, tabular data retrieval.
* **Zero-Overhead Favicon:** Utilizes an inline SVG Data URL for the 🧬 emoji favicon, reducing HTTP requests and improving load times.

---

## 🛠️ The Tech Stack ("The Engine Room")

This project adheres to strict **Separation of Concerns (SoC)**, decoupling logic, styling, and presentation.

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | Node.js / Express | Server-side logic, routing, and data validation. |
| **Frontend** | EJS (Embedded JS) | Dynamic server-side HTML rendering. |
| **3D Engine** | Three.js | Interactive molecular visualization. |
| **Data Fetching** | Axios | Secure asynchronous communication with the EBI API. |
| **Security** | Helmet.js / Rate-Limit | Protection against XSS, clickjacking, and DDoS. |

---

## 🛡️ Security & Production Readiness

To meet production-grade standards, the application is fortified with multiple security layers:
* **Content Security Policy (CSP):** Strict whitelisting of external CDNs (Cloudflare, jsDelivr, EBI) to prevent malicious script injection.
* **Rate Limiting:** Users are restricted to 50 queries every 15 minutes to prevent API abuse and protect system resources.
* **Input Sanitization:** All user inputs are trimmed, case-normalized, and checked for minimum length before network requests are dispatched.

---

## 💻 Local Setup & Installation

**Pre-requisites:** Node.js (v18+) and npm installed.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YourUsername/protein-explorer.git](https://github.com/YourUsername/protein-explorer.git)
   cd protein-explorer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   Open `http://localhost:3000` in your web browser.

---

## 🗺️ Future Roadmap
* **PDB Integration:** Moving from procedural conceptual models to parsing real `.pdb` atomic coordinate files.
* **Export Functionality:** Allowing users to download protein data summaries as PDF or JSON.
* **Multi-Gene Comparison:** Side-by-side visual analysis of two different proteins.
```

