import { Slide } from '@/types/pitch-deck';

export const SLIDE_TEMPLATES: Record<string, { layout: string; description: string }> = {
  cover: {
    layout: 'centered',
    description: 'الغلاف — اسم المشروع وشعاره مع شعار تقديمي',
  },
  problem: {
    layout: 'two-column',
    description: 'المشكلة — عرض نقاط الألم في السوق',
  },
  solution: {
    layout: 'two-column',
    description: 'الحل — كيف يحل منتجك المشكلة',
  },
  market: {
    layout: 'chart',
    description: 'السوق — حجم السوق وفرص النمو',
  },
  product: {
    layout: 'content-left',
    description: 'المنتج — عرض المنتج أو الخدمة',
  },
  'business-model': {
    layout: 'grid',
    description: 'نموذج الأعمال — كيف ستربح',
  },
  traction: {
    layout: 'timeline',
    description: 'الإنجازات — النمو والإنجازات الرئيسية',
  },
  team: {
    layout: 'grid',
    description: 'الفريق — أعضاء الفريق وخبراتهم',
  },
  financials: {
    layout: 'chart',
    description: 'المالية — التوقعات المالية',
  },
  ask: {
    layout: 'centered',
    description: 'التمويل — المبلغ المطلوب واستخداماته',
  },
  blank: {
    layout: 'blank',
    description: 'شريحة فارغة — محتوى حر',
  },
};

export function getSlideTemplate(type: string) {
  return SLIDE_TEMPLATES[type] || SLIDE_TEMPLATES.blank;
}

export function generateSlideId(): string {
  return `slide-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptySlide(type: Slide['type'] = 'blank', order: number = 0): Slide {
  return {
    id: generateSlideId(),
    type,
    title: '',
    content: '',
    bullets: [],
    speakerNotes: '',
    order,
  };
}
