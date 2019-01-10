const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false, args: [ '--proxy-server=165.225.116.16:80' ] });
  const page = await browser.newPage();
  await page.setViewport({width: 768, height: 1024, deviceScaleFactor: 2})
  
  try {
  var url = process.argv[2];
  await page.goto(url);
  const wordsSelector = '#lesson-resources-content';
  await page.waitForSelector(wordsSelector);

  const words = await page.evaluate(wordsSelector => {
    const elements= Array.from(document.querySelectorAll(wordsSelector));
    return elements.map(element => {
      const words = element.innerText;
      return words});
    }, wordsSelector);
  for (var indexWord in words) {
    console.log(words[indexWord]);
  }
  }
  catch(e) {}
  finally {
  await page.close();
  await browser.close();
  }
})();
