const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем запросы с любого домена
app.use(cors());
app.use(bodyParser.json());

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyBSQmGT5cFvUqhVy3NFTP1esqkNouEm0qe_bsnBn7ppvDHOaUQBimHloGljz7dEdB1/exec";

app.post("/submit", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
