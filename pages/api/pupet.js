import puppeteer from "puppeteer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const { html } = req.body;

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/opt/render/.cache/puppeteer/chrome/linux-149.0.7827.22/chrome-linux64/chrome'
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A2",
      printBackground: true,
      margin: {
        top: "140mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="invoice.pdf"'
    );

    res.end(pdf);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "PDF generation failed",
    });
  }
}
