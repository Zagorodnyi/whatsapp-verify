const puppeteer = require("puppeteer");
const fs = require("fs");
const WhatsAppVerificationService = require("../VerificationService/WhatsAppVerificationService");
const logsDir = "./logs";

async function checkNumberBulk(phoneNumbers) {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      userDataDir: "./profileData",
      args: ["--no-sandbox", "--disable-extensions"],
    });

    const VS = new WhatsAppVerificationService(browser, {
      currentPosition: 0,
      validateLength: 11,
    });
    const { results, currentPosition } = await VS.setNumbersList(phoneNumbers).validateList();

    await browser.close();
    fs.writeFileSync("./logs/results.json", JSON.stringify(results), {
      encoding: "utf-8",
    });

    return results;
  } catch (err) {
    console.error(err);
  }
}

module.exports = checkNumberBulk;
