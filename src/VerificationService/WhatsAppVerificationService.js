const chalk = require("chalk");
const fs = require("fs");

class WhatsAppVerificationService {
  constructor(browser, options) {
    this.options = options;
    this.browser = browser;
    this.curentPosition = options?.currentPosition || 0;
    this.results = [];

    this.LOG = fs.createWriteStream("./logs/log.txt", {
      flags: "a",
      encoding: "utf-8",
    });
  }
  setNumbersList(list) {
    this.list = list;
    return this;
  }

  async validateList() {
    if (!this.list) {
      throw new Error("Expected numbers array but got 'undefined'. Make sure to use 'setNubersList()' first.");
    }
    for (let i in this.list) {
      this.curentPosition = i;
      const record = this.list[i];
      const [name, rawPhoneNumber] = this._extractDataFromLine(record);

      const phoneNumber = this._getPhoneNumber(rawPhoneNumber);
      if (!phoneNumber) {
        this.LOG.write(`[${new Date().toISOString()}]: Number ${rawPhoneNumber.trim()} - SKIPPED\n`);
        continue;
      }

      this.LOG.write(`[${new Date().toISOString()}]: Attempt to check ${phoneNumber}\n`);

      // Chek number exsistance
      try {
        await this._openPage(phoneNumber);
        const exists = await this._validatePage();

        if (exists) {
          const tempJSON = fs.createWriteStream("./logs/tempResults.json", {
            flags: "w",
            encoding: "utf-8",
          });

          this.results.push({
            name,
            phoneNumber,
          });

          tempJSON.write(JSON.stringify(this.results));
          console.log(chalk.green(phoneNumber));
        } else {
          console.log(chalk.red(phoneNumber));
        }

        this.LOG.write(`[${new Date().toISOString()}]: ${name}: ${phoneNumber} – ${exists ? "VALID" : "INVALID"}\n`);

        await this.page.close();
        await new Promise(r => setTimeout(r, 5000)); // Timeout to save from ban
      } catch (err) {
        console.log(err);
        console.log(chalk.yellow(currentPosition));
        return { results: this.results, currentPosition: this.curentPosition };
      }
    }
    return { results: this.results, currentPosition: this.curentPosition };
  }

  async _validatePage() {
    if (!this.page) throw Error("Cannot find open page");

    try {
      await this.page.waitForSelector("#main", {
        timeout: 3000,
      });
    } catch (err) {
      /**
       * This error handling depends on class selector and
       *  won't work if WhatsApp decide to make stype changes
       */
      const message = await this.page.$("._2Nr6U");
      if (message.toString() !== "JSHandle@node") await new Promise(r => setTimeout(r, 1000)); // Add extra timeout if page is not loaded completely
    }

    return (await this.page.$("#main")) !== null;
  }

  async _openPage(phoneNumber) {
    const page = await this.browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
    );

    await page.goto(`https://web.whatsapp.com/send?phone=${phoneNumber}&text&app_absent=0`, { waitUntil: "load" });

    await page.waitForNavigation({
      waitUntil: "networkidle2",
    });

    this.page = page;
    return page;
  }

  _validateNumberLength(normalizePhonedNumber) {
    return normalizePhonedNumber.length < this.options.validateLength ? false : normalizePhonedNumber;
  }

  _normalizePhoneNumber(rawPhoneNumber) {
    const match = rawPhoneNumber.toString().match(/([0-9])+/g);
    return match.join("");
  }

  _getPhoneNumber(rawPhoneNumber) {
    const normalizedPhoneNumber = this._normalizePhoneNumber(rawPhoneNumber);

    if (this.options.validateLength) {
      return this._validateNumberLength(normalizedPhoneNumber);
    } else {
      return normalizedPhoneNumber;
    }
  }

  _extractDataFromLine(record) {
    if (record.includes(":")) {
      return record.split(":");
    }
    return ["Unnamed", record];
  }
}

module.exports = WhatsAppVerificationService;
