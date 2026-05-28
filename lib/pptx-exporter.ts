import pptxgen from 'pptxgenjs';
import { Slide, BrandingConfig } from '@/types/pitch-deck';

export async function exportToPPTX(slides: Slide[], branding: BrandingConfig): Promise<Blob> {
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = slides[0]?.title || 'Pitch Deck';
  pptx.author = 'marfa.sa';

  const bg = branding.secondaryColor.replace('#', '') || '0a0f1e';
  const primary = branding.primaryColor.replace('#', '') || 'c9a84c';

  pptx.defineSlideMaster({
    title: 'MARFA_MASTER',
    background: { color: bg },
    objects: [
      {
        text: { text: 'مرفأ | marfa.sa', options: { x: 0.1, y: 6.9, w: 2, h: 0.3, fontSize: 9, color: '8a9bb8' } },
      },
    ],
  });

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const s = pptx.addSlide({ masterName: 'MARFA_MASTER' });

    s.addText(slide.title, {
      x: 0.5, y: 0.5, w: 9, h: 1,
      fontSize: 36, bold: true,
      color: primary, align: 'right',
    });

    if (slide.bullets?.length) {
      s.addText(
        slide.bullets.map(b => ({ text: b, options: { bullet: true } })),
        { x: 0.5, y: 1.8, w: 9, h: 4, fontSize: 18, color: 'f0eada', align: 'right' }
      );
    } else if (slide.content) {
      s.addText(slide.content, {
        x: 0.5, y: 1.8, w: 9, h: 4,
        fontSize: 18, color: 'f0eada', align: 'right',
      });
    }

    if (slide.speakerNotes) {
      s.addNotes(slide.speakerNotes);
    }

    s.addText(`${i + 1}`, {
      x: 9.2, y: 6.9, w: 0.5, h: 0.3,
      fontSize: 9, color: '4a5a78', align: 'center',
    });
  }

  return (await pptx.write({ outputType: 'blob' })) as Blob;
}
