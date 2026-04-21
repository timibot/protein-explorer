// Purpose: Production-hardened Express server for the Protein Explorer Capstone.
// Preconditions: Environment configured with ESM. Helmet and express-rate-limit installed.
// Postconditions: Server is protected against brute force, DOS, and common web vulnerabilities.

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 3000; // Allows hosting providers to inject their own port

// --- SECURITY MIDDLEWARE ---

// 1. Helmet: Sets 15+ secure HTTP headers automatically
// We configure Content-Security-Policy (CSP) to allow our external Three.js script to load safely
// --- UPDATED SECURITY MIDDLEWARE ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // We added 'cdn.jsdelivr.net' to the allowed script sources
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
        connectSrc: ["'self'", "https://www.ebi.ac.uk"],
        // Allow the browser to render the WebGL canvas
        imgSrc: ["'self'", "data:", "blob:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

// 2. Rate Limiter: Prevent API abuse
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 50, // Limit each IP to 50 search requests per window
  message: "Too many queries from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// --- STANDARD MIDDLEWARE ---
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// --- ROUTING & CONTROLLERS ---

app.get("/", (req, res) => {
  res.render("index.ejs", { proteinData: null, error: null });
});

// Purpose: Handles POST search with Strict Identity Verification.
// Logic: Rejects partial matches to ensure 100% data accuracy for the user.

app.post("/search", searchLimiter, async (req, res) => {
  const geneQuery = req.body.geneName.trim().toUpperCase();

  // 1. INPUT VALIDATION: Reject searches that are too short to be unique genes
  if (geneQuery.length < 2) {
    return res.render("index.ejs", { 
      proteinData: null, 
      error: "Search term too short. Please enter a full gene name (e.g., INS, BRCA1)." 
    });
  }

  try {
    const response = await axios.get("https://www.ebi.ac.uk/proteins/api/proteins", {
      params: { offset: 0, size: 1, gene: geneQuery },
      headers: { "Accept": "application/json" }
    });

    // 2. EXISTENCE CHECK
    if (response.data.length === 0) {
      return res.render("index.ejs", { 
        proteinData: null, 
        error: `No protein found for: "${geneQuery}".` 
      });
    }

    const protein = response.data[0];
    
    // 3. STRICT IDENTITY GATE:
    // Extract the primary gene name from the API response
    const officialGeneName = protein.gene && protein.gene[0] 
      ? protein.gene[0].name.value.toUpperCase() 
      : null;

    // Compare the user's query to the official name
    // If they aren't identical, we treat it as a 'false positive' and hide it.
    if (officialGeneName !== geneQuery) {
      return res.render("index.ejs", { 
        proteinData: null, 
        error: `Exact match not found for "${geneQuery}". Did you mean ${officialGeneName}?` 
      });
    }

    // If we passed the gate, render the dashboard
    res.render("index.ejs", { proteinData: protein, error: null });

  } catch (error) {
    console.error("EBI API Error:", error.message);
    res.render("index.ejs", { 
      proteinData: null, 
      error: "Database connection error. Please try again later." 
    });
  }
});

// --- SERVER INITIALIZATION ---
app.listen(PORT, () => {
  console.log(`SECURE: Protein Explorer running on http://localhost:${PORT}`);
});