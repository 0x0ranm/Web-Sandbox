const express = require('express')
const https = require("https");
const puppeteer = require('puppeteer');
const fs = require("fs");

const app = express()

// Configurations 
const port = 8888
const AuthorizationHeaderKey = "<modify>"
const AuthorizationHeaderValue = "<modify>"

// URL handler
app.get('/url', async (req, res) => {
    var auth_header = req.headers[AuthorizationHeaderKey]; 

    // Verifies that the client connects with a proper auth header
    if (!auth_header)
    {
        console.log("Attempt to access to URL without auth header")
        return res.json({"Error": "Unauthorized"});
    }

    // Verifies that the client connectes with a proper header value
    else if (auth_header != AuthorizationHeaderValue)
    {
        console.log("Attempt to access to URL without valid auth key")
        return res.json({"Error": "Unauthorized"});
    }

    // Extract the URL from the request
    const _url = req.query.url;
    console.log("Query page: " + _url);

    // Make sure that the URL exists in the request
    if (_url.length == 0)
    {
        return res.json({"Error": "URL must be provided to execute a new scan"});
    }

    // Call to GetPage to get page data
    try{
        pageData = {};
        pageData = await GetPage(_url);
    }
    catch(error)
    {
        return res.json({"Error": "Failed to query chrome-headless instance"});
    }
    return res.json(pageData);
})

async function GetPage(url)
/*
The function gets a URL, access to the URL and returns the page content and a screenshot from the page.
*/
{
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
            "--disable-web-security",
            '--no-zygote',
            '--incognito',
            "--window-size=1920,1080"
        ]
    });

    const page = await browser.newPage();

     try{
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1440, height: 1024});
        await page.goto(url);
     }
     catch
     {
        return {"Error": "Puppeteer failed to execute goto function"}
     }


    // Attempt to get page screen shot
    const screenData = await page.screenshot({encoding: 'binary', type: 'jpeg', quality: 30}); 

    // Attempt to get page content
    const pageData = await page.content();
    
    // close open objects 
    await page.close();
    await browser.close();

    // return data
    return {"image": screenData, "content": pageData};
}

// Creating HTTPs server, initalize the server with private and public key. 
https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(port, () => {
    console.log("Server is runing on port " + port);
  });