# Amazon-price-tracker
Eagerly waiting for the price of a product to drop? Fretting over missing the opportunity and checking your phone again and again? Well, fuss no more as this price tracker would send you an email when the product comes in your budget! 

It works as follows:
1. Add the url of the desired product in the credentials file.
2. Accepts your budget from the terminal and runs the script.
3. The webpage opens up and scrapes the cost of the product.
4. If the price lies within your budget, a mail is sent to you which contains the dropped price and a link to the product.
5. You can schedule the frequency of the price check according to your wish. Here, i have set it to 15 seconds.

I have used puppeteer for automation, cheerio for web scraping and libraries like nodemailer that sends mails from node and node-cron that allows you to execute a function on a schedule.
