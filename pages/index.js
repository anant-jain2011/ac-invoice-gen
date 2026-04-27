import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const ref = useRef();

  const getPhoto = async () => {
    let elem = ref?.current;

    const canvas = await html2canvas(elem, {
      scale: 2, // 🔥 improves quality
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/jpeg");

    const pdf = new jsPDF("l", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let y = 0;

    // If content is taller than one page
    while (y < imgHeight) {
      pdf.addImage(imgData, "JPEG", 0, y ? 0 : 0, imgWidth, imgHeight);
      y += pageHeight;

      if (y < imgHeight) pdf.addPage();
    }

    pdf.save("output.pdf");

    // let cc = document.createElement("a");
    // cc.href = url;
    // cc.download = "true";
    // cc.click();
  }

  return (
    
  );
}
