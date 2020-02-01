const puppeeteer = require('puppeteer');

const pointUrl = 'https://www.ahgora.com.br/batidaonline';

const perfectPoint = async () => {
  const browser = await puppeeteer.launch();
  const page = await browser.newPage();
  await page.goto(pointUrl);
  await page.evaluate(() => {
    localStorage.setItem(
      'pontoweb_identity',
      'bdef3818d0b4a650ce3a1bf04049c622'
    );
  });
  await page.goto(pointUrl, {
    waitUntil: 'networkidle0'
  });
  await page.on('response', async response => {
    const { result } = await response.json();
    if (!result) {
      console.log('errow');
    }
  });
  await page.click('input#account_i');
  await page.keyboard.type('50318', {
    delay: 15
  });
  await page.click('input#password_i');
  await page.keyboard.type('50318xzxzxz', {
    delay: 15
  });
  await page.click('button#botao_entrar');
};

const init = () => {
  perfectPoint();
};

init();
