let puppeteer = require("puppeteer");
let fs=require("fs");
let cheerio =require("cheerio");
let CronJob=require('cron').CronJob;
let nodemailer=require('nodemailer');
let credentialsFile = process.argv[2];
let budget = process.argv[3];


async function browserConfig(){
    let data = await fs.promises.readFile(credentialsFile, "utf-8");
    let credentials = JSON.parse(data);
    webpage = credentials.webpage;
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized","--disable-notifications","--incognito"],
        //slowMo:200
    });
    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
    await tab.setDefaultNavigationTimeout(0);

    await tab.goto(webpage, {
        waitUntil: "networkidle0"
    });

    return tab;
}

async function priceCheck(tab){
    await tab.reload();
    let html= await tab.evaluate(() => document.body.innerHTML);
    //console.log(html);
    fs.writeFileSync("index.html",html);

    let $= cheerio.load(html);

    let cost=$(".a-span12 #priceblock_ourprice",html).each(function(){
        let price=$(this).text();
        //console.log(price);
        let currentPrice=Number(price.replace(/[^0-9.-]+/g,""));
        //console.log(currentPrice);
        if(currentPrice<budget){
            sendNotif(currentPrice);
        }     
    }); 
}

async function sendNotif(price){
    let transporter=nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:'testeramazon922@gmail.com',
            pass:'Tester@amazon@922'
        }
    });

    let msg="Price dropped to" + price;
    let url=`<a href=\"${webpage}\">Link to product</a>`;
    let info=await transporter.sendMail({
        from: '"Price Tracker" <testeramazon922@gmail.com>',
        to: "anviksha1999@gmail.com",
        subject:"Price dropped to " + price +"/-",
        text: msg,
        html:url
    });

    console.log("Message sent: %s", info.messageId);
}


(async function track(){
    let tab=await browserConfig();
    let job=new CronJob('*/30 * * * * *',function(){
        priceCheck(tab);
    },null,true,null,null,true);
    job.start();

})();

