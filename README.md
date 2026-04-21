# 🧬 Protein Explorer: Technical Documentation

## 1. Project Overview
The **Protein Explorer** is a high-assurance bioinformatics web application designed to translate complex biological data from the **European Bioinformatics Institute (EBI)** into a user-friendly, interactive dashboard. It serves as a "Data Translator" for researchers and students, providing immediate visual and structural insights into protein sequences based on gene identity.

---

## 2. Core Features
* **Strict Identity Matching:** Prevents "fuzzy" matches; the system ensures 100% accuracy by validating user input against official gene nomenclature.
* **Dual-View Interface:**
    * **Dashboard View:** A data-rich experience featuring interactive 3D modeling.
    * **Minimalist View:** A high-contrast table optimized for rapid data retrieval.
* **Interactive 3D Rendering:** Uses WebGL to generate a procedural "Ball-and-Stick" model of the protein, colored according to biological CPK standards.
* **Responsive Design:** Architected to maintain usability across desktop and mobile browsers.

---

## 3. The Tech Stack ("The Engine Room")

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | Node.js / Express | Server-side logic and API routing. |
| **Frontend** | EJS (Embedded JS) | Dynamic server-side HTML rendering. |
| **3D Engine** | Three.js / WebGL | Interactive molecular visualization. |
| **Data Fetching** | Axios | Secure asynchronous communication with EBI. |
| **Security** | Helmet.js / Rate-Limit | Protection against XSS, clickjacking, and DOS. |
| **Styling** | CSS3 | Responsive layouts and UI state management. |

---

## 4. System Architecture & Data Flow

The application follows a strict **Separation of Concerns (SoC)**, ensuring that logic, styling, and presentation are decoupled for maintainability.



1.  **Request:** User submits a gene name (e.g., `TP53`) via the Frontend.
2.  **Controller:** The Express server validates the input and proxies the request to the EBI API using Axios.
3.  **Validation:** The Backend performs a strict string comparison to ensure the returned data matches the requested gene.
4.  **Response:** The server injects the validated JSON into the EJS template.
5.  **Render:** The browser loads the CSS for layout and the `main.js` script to initialize the 3D WebGL scene.

---

## 5. Security & Engineering Discipline
To meet production-grade standards, the following guardrails were implemented:
* **Content Security Policy (CSP):** Strict whitelisting of external CDNs to prevent malicious script injection.
* **Rate Limiting:** Users are restricted to 50 queries every 15 minutes to prevent API abuse and protect system resources.
* **Input Sanitization:** All user inputs are trimmed and case-normalized before being processed.
* **Error Boundaries:** Graceful handling of network failures, 404s, and empty datasets to prevent application crashes.

---

## 6. Local Setup & Installation

**Pre-requisites:** Node.js (v18+) and npm installed.

1.  **Clone & Install:**
    ```bash
    git clone [your-repo-url]
    cd protein-explorer
    npm install
    ```
2.  **Configuration:**
    Ensure `package.json` contains `"type": "module"`.
3.  **Execution:**
    ```bash
    npm start
    ```
4.  **Access:**
    Open `http://localhost:3000` in your browser.

---

## 7. Future Roadmap
* **PDB Integration:** Moving from conceptual 3D models to loading real `.pdb` atomic coordinate files.
* **Export Functionality:** Allowing users to download protein data as PDF or JSON.
* **Multi-Gene Comparison:** Side-by-side analysis of two different proteins.
