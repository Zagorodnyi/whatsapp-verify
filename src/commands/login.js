const chalk = require("chalk");
const LOG = console.log;
const puppeteer = require("puppeteer");

(async () => {
  LOG(chalk.blue("Opening a browser window, please scan / login on Whatsapp"));
  LOG(chalk.yellow("Once you're logged in, you can close the page or tab"));

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./profileData",
    args: ["--no-sandbox", "--disable-extensions"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
  );
  await page.goto(`https://web.whatsapp.com/send?phone=${45553535}&text&app_absent=0`, { waitUntil: "networkidle0" });
  await page.waitForNavigation({
    waitUntil: "networkidle2",
  });

  browser.on("targetdestroyed", async () => {
    LOG(chalk.yellow("Page Closed. If logged in you can use the check command"));
    browser.close();
  });
})();
