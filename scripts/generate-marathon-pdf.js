const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Navigate to the page
    await page.goto('http://localhost:3001/sponsorships/hail-marathon-2026', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });

    // Wait a bit for any animations/fonts to load
    await page.waitForTimeout(2000);

    // Generate PDF
    await page.pdf({
        path: 'public/برنامج-رعاية-ماراثون-حائل-2026.pdf',
        format: 'A4',
        printBackground: true,
        margin: {
            top: '0mm',
            right: '0mm',
            bottom: '0mm',
            left: '0mm'
        },
        preferCSSPageSize: false
    });

    console.log('PDF generated successfully: public/برنامج-رعاية-ماراثون-حائل-2026.pdf');

    await browser.close();
})();
