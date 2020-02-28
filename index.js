const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/**********************Server**********************/
// Reads the "data.json" file in folder "dev-data"
// 'utf-8' is English
// Only happens once
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
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

// Occurs each time a new request is made
const server = http.createServer((req, res) => {
  // Save req.url into a variable called "pathName"
  const { query, pathname } = url.parse(req.url, true);

  // Checks the url
  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    // Write from html
    res.writeHead(200, {
      'Content-type': 'text/html'
    });

    // Gonna loop with a map to return something that we will save into a new array
    // For each element we are returning something and will be put into the same position new cardsHtml array
    // Replace placeholders - replaceTemplate function
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  } 
  // Product page
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } 
  // API
  else if (pathname === '/api')   // If /api we will get the data.json file
  {
    // 200 stands for 'ok'
    // Sends back our data from data.json
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(data);

  }
  // Not found 
  else 
  {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
