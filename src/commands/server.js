const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(bodyParser.json());

// Utils
const checkNumber = require("../utils/checkNumber");
const checkNumberBulk = require("../utils/checkNumberBulk");

// Check Single Number
app.get("/checknumber", async (req, res) => {
  const { phoneNumber } = req.query;
  const exists = await checkNumber(phoneNumber);
  return res.json({ phoneNumber, exists });
});

// Check Multiple Numbers
app.post("/checknumber", async (req, res) => {
  const numbersFile = fs.readFileSync(path.resolve("src", "numbers.txt")).toString();
  const phoneNumbers = numbersFile.split("\n");
  const result = await checkNumberBulk(phoneNumbers);

  return res.json({ result });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Started Server on port ${process.env.PORT || 3000}`);
});
