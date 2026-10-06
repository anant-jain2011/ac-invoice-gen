import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let browser = null;

  try {
    const { html } = req.body;

    browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(), // Extracts executable to /tmp safely
        headless: chromium.headless || true,
      });

    const page = await browser.newPage();

    // Use domcontentloaded for fast local HTML parsing
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    // Optional: If you use external fonts/images, wait for them specifically
    // await page.evaluateHandle(() => document.fonts.ready);

    const pdf = await page.pdf({
      format: "A2",
      printBackground: true,
      margin: {
        top: "108mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
    res.end(pdf);

  } catch (err) {
    console.error("PDF Generation Error:", err);
    return res.status(500).json({ message: "PDF generation failed" });
  } finally {
    // Always close browser to prevent memory leak timeouts
    if (browser !== null) {
      await browser.close();
    }
  }
}
