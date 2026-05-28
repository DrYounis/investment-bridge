import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPDF(containerRef: HTMLElement): Promise<void> {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1280, 720] });
  const slides = containerRef.querySelectorAll('[data-slide]');

  for (let i = 0; i < slides.length; i++) {
    const canvas = await html2canvas(slides[i] as HTMLElement, {
      backgroundColor: '#0a0f1e',
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, 1280, 720);
  }

  pdf.save('marfa-pitch-deck.pdf');
}
