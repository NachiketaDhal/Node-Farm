const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////////////////////////////////////////////////////
// Files
// Blocking, Synchronous way
// const textIn = fs.readFileSync(__dirname + "/txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about avocado: ${textIn}\n Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File updated");

// Non-Blocking, Asynchronous way
// fs.readFile("./txt/startt.txt", "utf-8", (err, data1) => {
//   if(err) {
//     return console.log("Error!💥");
//   }
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//         console.log("File updated successfully!");
//       })
//     });
//   });
// });
// console.log("Will read this!");

////////////////////////////////////////////////////////////////////////////////////////
// Server

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // JS object

const slugs = dataObj.map((el) =>
  slugify(el.productName, { lower: true, replacement: '_' })
);
// console.log(slugs);

// console.log(slugify("Fresh Avocados", {lower: true, replacement: '_'})); // fresh_avocados

const server = http.createServer((req, res) => {
  // const pathName = req.url;

  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARD%}', cardHtml);

    res.end(output);

    // Product page
  } else if (pathname === '/products') {
    // console.log(query);
    res.writeHead(200, { 'content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
