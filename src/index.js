const dotenv = require('dotenv');
dotenv.config();
const puppeeteer = require('puppeteer');
const client = require('twilio')(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

const pointUrl = process.env.PONTO_URL;
const key = process.env.PONTO_WEB_IDENTITY_KEY;
const value = process.env.PONTO_WEB_IDENTITY_VALUE;

const perfectPoint = async () => {
  try {
    const browser = await puppeeteer.launch();
    const page = await browser.newPage();
    await page.goto(pointUrl);
    await page.evaluate(
      ({ key, value }) => {
        localStorage.setItem(key, value);
      },
      { key, value }
    );
    await page.goto(pointUrl, {
      waitUntil: 'networkidle0'
    });
    await page.on('response', async response => {
      const { result } = await response.json();
      if (!result) {
        client.messages.create({
          body: 'Perfect point failed, please verify manually',
          from: process.env.TWILIO_NUMBER,
          to: process.env.MY_PHONE_NUMBER
        });
      } else {
        client.messages.create({
          body: 'Perfect point had success!',
          from: process.env.TWILIO_NUMBER,
          to: process.env.MY_PHONE_NUMBER
        });
      }
    });
    await page.click('input#account_i');
    await page.keyboard.type(process.env.PONTO_USER, {
      delay: 15
    });
    await page.click('input#password_i');
    await page.keyboard.type('xzxzxz', {
      delay: 15
    });
    await page.click('button#botao_entrar');
  } catch (error) {
    console.log(error);
  }
};
const init = () => {
  perfectPoint();
};

init();
