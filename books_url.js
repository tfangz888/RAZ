const puppeteer = require('puppeteer');

const urls = [
 'https://www.readinga-z.com/books/leveled-books/?lbFilter[level-aa]'
//,
// 'https://www.readinga-z.com/books/leveled-books/?lbFilter[level-Z2]'
];

(async () => {  
  const browser = await puppeteer.launch({headless: false, args: [ '--proxy-server=IP:PORT' ] });
  const page = await browser.newPage();
  await page.setViewport({width: 768, height: 1024, deviceScaleFactor: 2})

//  for (var index in urls)
//  {
    // var url = urls[index];
    var url = process.argv[2];
    await page.goto(url);
  
 //   await page.keyboard.press('PageDown');
    await autoScroll(page);
  
    var resultsSelector = '.book.book-portrait';
    await page.waitForSelector(resultsSelector);
    // Extract the results from the page.
    const books1 = await page.evaluate(resultsSelector => {
    const anchors = Array.from(document.querySelectorAll(resultsSelector));
      return anchors.map(anchor => {
        const title = anchor.childNodes[3].innerHTML;
        const url = `${anchor.href}`;
        return ({
         'title' : title,
         'url'   : url});
      });
    }, resultsSelector);

    var resultsSelector = '.book.book-landscape';
    const books2 = await page.evaluate(resultsSelector => {
    const anchors = Array.from(document.querySelectorAll(resultsSelector));
      return anchors.map(anchor => {
        const title = anchor.childNodes[3].innerHTML;
        const url = `${anchor.href}`;
        return ({
         'title' : title,
         'url'   : url});
      });
    }, resultsSelector);

    const books = books1.concat(books2);
    // console.log(books[0].title);
    // console.log(books[0].url);
    // console.log(books.length);

// write url into file
const fs = require('fs');
for (var indexData in books) {
  fs.writeFile("/tmp/raz/tmp/" + books[indexData].title + ".txt", books[indexData].url, function(err) {
    if(err) {
        return console.log('error in: ' + books[indexData].title);
    }
  }); 
}

/* 
    for (var indexData in books)
    {
        const page2 = await browser.newPage();
        const url2 = books[indexData].url;
        await page2.goto(url2);
        const wordsSelector = '#lesson-resources-content';
        await page2.waitForSelector(wordsSelector);

        const words = await page2.evaluate(wordsSelector => { 
        const elements= Array.from(document.querySelectorAll(wordsSelector));
            return elements.map(element => {
                const words = element.innerText;
//                const words = element.childNodes[6].innerText + element.childNodes[7].innerText + element.childNodes[8].innerText;
                return words});
            }, wordsSelector);
        console.log('<<' + books[indexData].title + '>>');
        for (var indexWord in words) {
            console.log(words[indexWord]);
        }
        //console.log(words);
        await page2.close();
    }

*/
//    await page.keyboard.press('PageDown');
//  }

  await browser.close();
})();


async function autoScroll(page) {
  //console.log('[AutoScroll begin]');
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      // 页面的当前高度
      let totalHeight = 0;
      // 每次向下滚动的距离
      //let distance = 100;
      let distance = 1000;
      // 通过setInterval循环执行
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;

        // 执行滚动操作
        window.scrollBy(0, distance);

        // 如果滚动的距离大于当前元素高度则停止执行
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 5000);
    });
  });

  //console.log('[AutoScroll done]');
  // 完成懒加载后可以完整截图或者爬取数据等操作
  // do what you like ...
}
