import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public', 'case-studies');

function buildHTML(study) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Cairo', sans-serif;
    color: #1a1a1a;
    direction: rtl;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 13px;
    line-height: 1.85;
  }

  /* ── MARFA BRANDED HEADER (page 1 only) ── */
  .marfa-header {
    background: #0a0f1e;
    padding: 14px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    direction: rtl;
  }
  .marfa-header .brand-name {
    font-family: 'Cairo', sans-serif;
    font-size: 20pt;
    font-weight: 700;
    color: #c9a84c;
  }
  .marfa-header .domain {
    font-size: 10pt;
    color: #ffffff;
    font-weight: 400;
  }
  .marfa-header .slogan {
    font-family: 'Cairo', sans-serif;
    font-size: 9pt;
    color: #d8d5cc;
    margin-top: 2px;
  }
  .marfa-header .qr-block {
    text-align: center;
  }
  .marfa-header .qr-frame {
    background: #ffffff;
    padding: 4px;
    border-radius: 3px;
    display: inline-block;
  }
  .marfa-header .qr-img {
    width: 24mm;
    height: 24mm;
  }
  .marfa-header .qr-caption {
    font-family: 'Cairo', sans-serif;
    font-size: 7pt;
    color: #c9a84c;
    margin-top: 3px;
  }
  .gold-rule {
    height: 3px;
    background: #c9a84c;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 22mm 18mm 25mm 18mm;
    background: #FFFFFF;
    page-break-after: always;
  }
  h1 {
    font-size: 22px;
    font-weight: 900;
    color: #8B0000;
    text-align: center;
    margin-bottom: 2px;
    line-height: 1.3;
  }
  h2 {
    font-size: 14px;
    font-weight: 700;
    color: #1F4788;
    text-align: center;
    margin-bottom: 12px;
  }
  h3 {
    font-size: 13px;
    font-weight: 700;
    color: #1F4788;
    margin-top: 18px;
    margin-bottom: 6px;
    border-bottom: 1.5px solid #1F4788;
    padding-bottom: 4px;
  }
  h4 {
    font-size: 12px;
    font-weight: 700;
    color: #1F4788;
    margin-top: 10px;
    margin-bottom: 4px;
  }
  p { margin-bottom: 6px; text-align: justify; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px; }
  table.meta td.label { background: #F0F0F0; font-weight: 700; width: 120px; text-align: right; padding: 5px 8px; vertical-align: top; }
  table.meta td { background: #F5F5F5; padding: 5px 8px; vertical-align: top; border: 1px solid #DDD; }
  table.data th { background: #1F4788; color: white; padding: 6px 8px; font-weight: 700; text-align: center; }
  table.data td { padding: 5px 8px; border: 1px solid #DDD; text-align: center; }
  table.data tr:nth-child(even) td { background: #F5F5F5; }
  .dilemma-box {
    background: #FFF8F0;
    border: 2px solid #8B0000;
    border-radius: 2px;
    padding: 14px 16px;
    margin: 14px 0;
    text-align: center;
    font-weight: 600;
    color: #5B3500;
    font-size: 12px;
    line-height: 1.8;
  }
  .dilemma-box .label { font-size: 14px; font-weight: 800; color: #8B0000; display: block; margin-bottom: 8px; }
  ul { padding-right: 18px; margin-bottom: 4px; }
  li { margin-bottom: 2px; font-size: 12px; }
  .page-header { font-size: 11px; color: #888; margin-bottom: 14px; text-align: left; }
  .page-footer {
    margin-top: 20px; padding-top: 10px; border-top: 1px solid #D4AF37;
    font-size: 10px; color: #999; display: flex; justify-content: space-between;
  }
  .small { font-size: 10px; color: #888; }
</style>
</head>
<body>
<div class="marfa-header">
  <div class="qr-block">
    <div class="qr-frame"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXIAAAFyCAIAAABnRsZeAAAHuElEQVR4nO3cMXIsNRhGUUy9jIQdsP9lsQMS4iYlUhVPV/zq8Tm5Pe2Z8S0FX+nreZ5fADq/Tj8A8GlkBYjJChCTFSAmK0BMVoCYrAAxWQFisgLEZAWIyQoQkxUgJitATFaAmKwAMVkBYrICxGQFiMkKEPux88O//f5H9RyX+PuvP3/6Z3fejTtf99zne+513/ib77TznXRaAWKyAsRkBYjJChCTFSAmK0BMVoCYrAAxWQFiWyvbtZ2V3jlTa8g7N5rr1z33zHduUs99Y7/b/4LTChCTFSAmK0BMVoCYrAAxWQFisgLEZAWIyQoQO7iyXZu6J3XKneveqd+8s+7d+c13+rz/BacVICYrQExWgJisADFZAWKyAsRkBYjJChCTFSB2cGX73cy5HLV2/bfzKTjnnPerN25/38hpBYjJChCTFSAmK0BMVoCYrAAxWQFisgLEZAWIGVv+m50l5s7b2TnvTX2HU+83d+71G9/fO04rQExWgJisADFZAWKyAsRkBYjJChCTFSAmK0Ds4Mr2vDtQd2zt3N3wnfe5s/5UeyeXo2t3fipOK0BMVoCYrAAxWQFisgLEZAWIyQoQkxUgJitA7ODKdq9m3bn8d+4w7jid25VL6LU795BT5/13Nq3mnFaAmKwAMVkBYrICxGQFiMkKEJMVICYrQExWgNjX8zwjL5xaw9w5e02tP6dMbfzufCpTG/2p25dvXAl3WgFisgLEZAWIyQoQkxUgJitATFaAmKwAMVkBYlt32a6dOjvn1jB3/nWp1+1czk2Nuk191vfmM3xLO3dacVoBYrICxGQFiMkKEJMVICYrQExWgJisADFZAWJjK9tTUyvGHefWwNfmToHndqXrQ++p+23v3LxOcVoBYrICxGQFiMkKEJMVICYrQExWgJisADFZAWJfd5aMp0yNn9c2pna859bAU6Z+M3NaAWKyAsRkBYjJChCTFSAmK0BMVoCYrAAxWQFiB1e2d3auazsn7p1722nnXnfqE37j8/lud94Nc1oBYrICxGQFiMkKEJMVICYrQExWgJisADFZAWJbd9l+nnsXs+emYtY7pna0p9bJp//y1CnQaQWIyQoQkxUgJitATFaAmKwAMVkBYrICxGQFiB282nZqE3xn5boyNdq/M7U+PLcSO7UVMrUz7p1WgJisADFZAWKyAsRkBYjJChCTFSAmK0BMVoDY1sp2/WNTZ/zU57M2dRqcGkLf55g3HllOTfTP7XzY5rQCxGQFiMkKEJMVICYrQExWgJisADFZAWKyAsQOrmxPbW3s7FOnDqxTu+VnG7fV5k5hU89jEzn3bs95+3KnFSAmK0BMVoCYrAAxWQFisgLEZAWIyQoQkxUg9vU8z0//8NRScMpj0vZ9p+13pnbAp97Jqe36RDN2Pn+nFSAmK0BMVoCYrAAxWQFisgLEZAWIyQoQkxUgtnWX7dTObsrc0nGtYmpodM6d7/TUenc/mXWb63e+h06pQCKRlbsgT9P0SK6nQ8BlRgACNmVu5JHMTwQByDRA0QpyJA3GeSdRJRFkw3MkAm1IGpBqCpQF5KguOWqomtRJFkj2QpCj6CjA5IinJyX4LWAkkrJNQLMjoShiWTNGqpUjmiqTIA01iOtqhqZRIroSqDJGulooQyRE1JpGiqKlGmiA5Aigo2kC4AFIE6IIo6akBEdCXQVVWKNBFiIDIAWboKCIaCFEEdGmUCNI6oCHQmVKgo0RErpKhgkigQo0KIkhUBJhuCQjSRoK0ImyREQRfInghRIqBI6gqkqOqoGpURJpG6IgE2AgCpaKJEE5gBUMmlKiBQIJoANKlYIEKCSjoBGqCrQJI3QZgSqMqSKMqCUSiaJ1EAGWAmWqE0CUKQpQJJAjQOQp6NBGDJEgGyqJCED6CCAoGiCRKBMgjSilEEWqIqCAZQoI0ioIEQfQE6kCemRAIuoClUmcpuiQAJoI1QpEwhDQmZJoq1QpspoihqKYMGYME6EhKRIoK2IKAZgqFpIEpEm6oAoKooIWCiAKIYhABoCXBdKhMogmRojIJAMbYqmqIhmqpLgybQo6KMyKoqGqipIimSohBI5opEy2RACZCRLpBCIaUgQwKpkkWiKqqKoFgAmoiVDNgqwKYJAJ4EumSRIqKAoQxI5AklSNIIkqCqqCAYQI4yoCiWKGS1JBpJpCqqJoiJbIQCmRkqLRCkoAIoGqsoSCAUVKMpBmAgAIkCRNgqmikTI9oAFUgmSRCAJ4MgTKNTogEiiTRBNAKANIlqiIBggKCoCkqkaBJqwJgQioqkYoqqAogSKKkGCigiAbSIjUAtEgg6AhgSQASDCkAK0oYJAo1BokSJLokAUSAvAwKG5JpAiAT6Il2aSLJmqEhCybRApqkqOpopEiobIquhIomqIEW6IIiqIykigpmiITqMqSRqhJZIkITdKoSmSIhmCIgiaJTOiQiIhGyBBpgqEiiqIGiKQKpQqipMmjBJiqQomCjoQiIxoiopmqoCBKfAauqkQWqCqlIpoKSBAoIiiAJ0QoQJoEgKSJRIqoqSCpiicGqWuEBClQqCoiISRbIQZqiYQCKBIxSqAKDdCbQBVI6kiyBCopMoiQbDCpZJqAqyigASPoaaUgqaIiiLIGjipGiWqqIGQlBHJEumSJNAISRBE2QQTIpGkAkaoYJ4AqpJEo6NookSSKis5IgCSUYkVEFoWoFSQgGWQQCiiHRAIqsqTBApFwkgEqaJIqkmANIlKkCSJI0ASmmRgLSoSdIgYqmCaFoABAAgSQaiAJCgqMQIiSSqSpMqzQAAyGCYDYMiFisLwiooUMoSNPkGdLoOmGDNEgKRIIoKCaSIGqCLpmA8JMGkAFYE2R8KJywCgUQoFCqKJpEkkCGrRqCQAJNGAV1HJDpJCNkRAgaVSCJaqQO2oQhIlp4BAuqUm0iOsCIAHoKnQFpFKAkVH+DRByJInCJcqoqgMADiFOOaZIuoqopE0ACqZQoRqFRK9BFTEqAhskgeCgmkCclAAQIEOY6HpwoCgHSQIaIAANiq4jaIwMaA/AiM3ANcqDIBDaqWgTCBNKBsWqpoJBBJ0aKRKAiCFdJ1IAA6JNpI8AVCEREUGRClIqDSYoiQIJaigbQKJGqIoEMqqoKjAYVABtqiEJDtKpCBRVGqhQAAyiqBA4qGqBAoImeKiQjSBSNIBopqgIA+mQAWqApVBiBgQkAJ0ggGigDBkgMAAzRIhmqQooqCKBIBgIIkmA4mqGyh6iSR1CIBOADpCgDIBNIiNogAkhQWCAIgGyCDBKhoAamgwpCFQokgmaiiigiXKIBqgYBgshigYKGJopKMAmAiiCJAEllCo5oAXRI00YEm0qAwAmCDAhkKoAkBIKjSEYiaADQiitIsgIaKqmmRIqCigAidKGaVEiSGoqqQcqgRRpIgQBKgUCIoFigqqooR6ogBQK0FBQpBokgBGKEiCuRpgSqAKqizSAKgIIgQAKgCUBCqBogCYoqUFABqQSDaoqkARUYRGAIESKoMiCkEpmCJFAjAGgkhKZIDhrIgRJRCIkwoqQQqKUCooAamEMoKKoGIlAACEKqCIIFpEjESkAwQSTIklAmhKjAqQqUKPxLJBmSDJAIkKJQEiADI1QLSopgqoqhSAKk0QIpoAkookdSBQK0SopQIDoFCMiCSkiAPBAhoiMAEGRMpIkKgyBYgCqSTIAOAliKBqomCBoBhaKJqoqiSh4CJDCEAHpKoFaJAJAKKCEmkaJZOphV6aLhCqKFMiwAcAKZCiBKxZqooOQAQAFMQgaJYqkgC2CJEAWAB3mSIAlDCKoIDjqsmSqAMFFKmkAq2oEAFyAkKSJIoCaS0R8gwKChQpkqkDWACSYAEIKIEKEiBAEEA6QqqokIcCkrSUA6qBUAGCEaQCki0YAEKjIIAC1RIlopqgCEAomqiIokMhJEtAElkqEJKqYQhxJ1SSAJqCqKDEAJlCiSIqIyBESqgRqII0Ki8AKIkksJBCpSL0iSqYomqQAaBQJAAJoIgCkmiWqJI0iCqSQyRIlk8BXUolMkZpCqBA5AAaVLKAJYANgE0q3yqYUYQZKIAUqSESApqqCggKaYIAaKAUgkEqKoqqBQRARIiqKEJSRbQBNchqOh0waa4JQokqsogSKCSBJAgCkxCAioRogYEyhSkCqSqqkCQAo0tAqgUCSKQKq2pFDPAVSAqA6gE6Iq6IhAHoIeggIksSSQCnQoAEkqCuUAOYAK0qskCCgNEhQgAUQLRqCKIomgIgSwoAiiYQoqAKhYQslKSKypLQ0mSMSSQmkAgKpCgkpKIEimKQSSKCuBqKLgDDQqSKagICpHIFQqqggQImqYkTkqJpoSSAIaSnBEiED4BKQEkEBUjoSBRGqAAGMAIEiESkIoyaApAkaoKCpCwY1BGCIipNoogSqIVKtBHCoNAEowEW0SSSAJhJNgRRpsoAoAToGSEBC1I0YqQFcoQIlh6BABgCBAKxQQibAKqIuigAK6SqGYJIIAkQNIMcqSRpAFkQRAAaBMAF6hSESE2CbSZIoIZqgKkSKQIqAiRAkhLoAoAPwCECFNEiCpDRIEggUBEiCoADoAkQIgSQBAqsiQBBFQEBIloFoMGSIKAIMBMIFgMkwSQYIik6iCFBChAMiCNFBICqmEUTAoMQFEgBRIlGhBIKhAEpEi4JOIoEAJQUEBtkSKAIMqBBTtIkFEyYAAimBUEoVLIEB2SBHAAgRIlEGIBEpaIgmCRJEQSKooIKSkWaCCpCpEgEoA+RASJAAoKsBkAGQgECAAQIKiIEKlRJIKCESChEmgYFAALoKtCCYCFAIiAAIJgEUQSKosAqNIEJ0kkowHQJGkAKEkHAorCgFokiGNBBQKAoECQSRAiQPUIkIEKNQRKkAIigS0SAJEsDAAaVCAqqBooSGFRQSTBaIEPIqjagQARIgEAQo6RJJAUG6EkkEQAKABRIEkkSgYokAAiqJAiS4iIJAkigiCEMKhYoMGpDoAFSEgIJEgAIFaAi1SOKAkiRkkCARFoCiiGgoAGFMqSEgiKAApiUDAACVIqJDiKSooGASaoESK1ogAACUECJKIkgGBlAkCJJEYG+BAAsSKiqQAiGKgCoIoKEr8CmCUCKgiI1H/AOO1/QP13sGEAAAAASUVORK5CYII=" class="qr-img"></div>
    <div class="qr-caption">امسح للانضمام للجلسات</div>
  </div>
</div>
<div class="gold-rule"></div>
${study.html}
</body>
</html>`;
}

const CASE_STUDIES = [
  // ==================== Netflix — Innovation ====================
  {
    filename: 'Netflix_Innovation_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>Netflix: الابتكار من خلال تدمير الذات — من تأجير DVD إلى إمبراطورية الستريمنج</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>Netflix, Inc.</td></tr>
    <tr><td class="label">الصناعة</td><td>الترفيه / البث الرقمي</td></tr>
    <tr><td class="label">التأسيس</td><td>1997 — ريد هاستينغز ومارك راندولف</td></tr>
    <tr><td class="label">المقر الرئيسي</td><td>لوس غاتوس، كاليفورنيا، الولايات المتحدة</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>الإيرادات 2023: 33.7 مليار دولار | المشتركون: 260 مليون+ | القيمة السوقية: 200 مليار+ | 190 دولة</td></tr>
    <tr><td class="label">محور الدراسة</td><td>الابتكار — استراتيجية تدمير الذات والتحول الرقمي</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>تحليل كيف تدمر شركة ناجحة نموذج عملها الحالي عمداً لتبني نموذج جديد قبل أن يفعلها المنافسون</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>في عام 1997، تأخر ريد هاستينغز في إعادة فيديو Apollo 13 المستأجر ودفع غرامة 40 دولاراً. من هذه اللحظة المحرجة، وُلدت Netflix كخدمة تأجير DVD عبر البريد بدون غرامات تأخير. بحلول عام 2005، كانت الشركة تشحن مليون قرص DVD يومياً. ثم في عام 2007 — في ذروة نجاح نموذج DVD — أطلق هاستينغز خدمة البث المباشر. اعتقد الجميع أنه مجنون. كانت هوامش DVD ممتازة. الإنترنت لم يكن سريعاً بما يكفي. لماذا تدمر مصدر دخلك الرئيسي طواعية؟</p>
  <p>في عام 2011، حاول هاستينغز فصل DVD عن البث تحت اسم Qwikster — فشل ذريع. انخفض السهم 77%. استقال. اعتذر. عاد أقوى. ثم في عام 2013، اتخذ القرار الأكثر جرأة على الإطلاق: Netflix لن تكون مجرد موزع بعد الآن — ستصبح منتجة محتوى. دخلت House of Cards بـ 100 مليون دولار. ضحك الجميع مرة أخرى. اليوم، تنفق Netflix 17 مليار دولار سنوياً على المحتوى الأصلي. لقد تحولت من خدمة تأجير أقراص إلى شبكة البث الرائدة في العالم.</p>
  <p>تتناول دراسة الحالة هذه فلسفة "تدمير الذات" — كيف تقدم على قتل مصدر دخلك الأساسي طواعية لتبني مستقبل غير مؤكد. Netflix دمرت نموذجين ناجحين خاصين بها قبل أن يفعلها أي منافس: أولاً نموذج DVD لصالح البث، ثم نموذج التوزيع لصالح إنتاج المحتوى الأصلي. أصبحت كلمة Netflix اسماً فعلياً — "Netflix and chill" — علامة تجارية عالمية. والسؤال المركزي: هل يمكن للمؤسسات التقليدية تطبيق فلسفة تدمير الذات هذه، أم أنها حكر على الشركات الناشئة؟</p>

  <h3>الخلفية والتاريخ</h3>
  <p>شارك ريد هاستينغز في تأسيس Pure Software عام 1991 وباعها عام 1997 مقابل 750 مليون دولار. تعلم درساً صعباً: البيروقراطية تقتل الابتكار. مع Netflix، صمم ثقافة مضادة للبيروقراطية بشكل جذري — "الحرية والمسؤولية" التي وُثقت لاحقاً في عرضه الشهير "ثقافة Netflix". المبدأ الأساسي: وظف بالغين ناضجين، امنحهم سياقاً بدلاً من تحكم، واطرد المتوسطين بسخاء.</p>
  <p>كان قرار البث عام 2007 مقامرة وجودية. كانت خدمة DVD تطبع النقود. جودة البث كانت رديئة. مكتبة المحتوى كانت محدودة. لكن هاستينغز رأى أن الأقراص المادية ستصبح عتيقة حتماً. بدلاً من انتظار أن يدمره شخص آخر، قرر أن يدمر نفسه أولاً. استثمر مئات الملايين في تراخيص البث وخوادم التوصيل بينما ما زال نموذج DVD يدر أرباحاً. بحلول 2013، تجاوزت اشتراكات البث اشتراكات DVD. أوقف هاستينغز استثمارات DVD بالكامل.</p>
  <p>ثم جاءت لحظة House of Cards. عرض ديفيد فينشر وكيفن سبيسي المشروع على HBO وShowtime و AMC — جميعهم رفضوا. عرضته Netflix بـ 100 مليون دولار لموسمين بدون رؤية حلقة تجريبية واحدة — فقط ثقة في البيانات التي أظهرت أن المشتركين يحبون الدراما السياسية وأفلام فينشر وكيفن سبيسي. المعادلة كانت: بيانات + جرأة + موهبة = محتوى أصلي. نجحت. فازت House of Cards بتسع ترشيحات إيمي. ولدت استراتيجية المحتوى الأصلي لـ Netflix.</p>
</div>

<div class="page">
  <div class="page-header">دراسة حالة: Netflix — الصفحة 2 من 2</div>

  <table class="data">
    <thead><tr><th>السنة</th><th>المشتركون (مليون)</th><th>الإيرادات (مليار)</th><th>الحدث الرئيسي</th></tr></thead>
    <tbody>
      <tr><td>1997</td><td>—</td><td>—</td><td>التأسيس كخدمة تأجير DVD بالبريد</td></tr>
      <tr><td>2007</td><td>7.5</td><td>1.2</td><td>إطلاق خدمة البث — تدمير نموذج DVD</td></tr>
      <tr><td>2013</td><td>44</td><td>4.4</td><td>إطلاق House of Cards — المحتوى الأصلي</td></tr>
      <tr><td>2017</td><td>117</td><td>11.7</td><td>أول شركة ترفيه تفوز بجائزة أوسكار كبرى</td></tr>
      <tr><td>2020</td><td>203</td><td>25.0</td><td>ذروة الجائحة — 37 مليون مشترك جديد</td></tr>
      <tr><td>2023</td><td>260+</td><td>33.7</td><td>التوسع في الألعاب والإعلانات</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. الابتكار وتدمير الذات</h4>
  <ul>
    <li>كيف تقدم Netflix على تدمير نموذجي عمل ناجحين تابَعين لها — أولاً DVD ثم التوزيع — طواعية قبل أن يفعلها أي منافس؟ ما الثقافة التي تسمح بذلك؟</li>
    <li>لماذا لا تستطيع معظم المؤسسات "تدمير نفسها" حتى عندما ترى التهديدات القادمة؟ طبق مفهوم "معضلة المبتكر" لكلايتون كريستنسن.</li>
    <li>هل انتقال Netflix من التوزيع إلى الإنتاج هو تدمير ذاتي حقاً، أم مجرد تنويع عمودي؟</li>
  </ul>
  <h4>2. الابتكار القائم على البيانات</h4>
  <ul>
    <li>كيف تستخدم Netflix البيانات لاتخاذ قرارات إبداعية؟ حلل قرار House of Cards كحالة اتخاذ قرار قائم على البيانات مقابل الحدس الإبداعي.</li>
    <li>ما حدود الابتكار القائم على البيانات؟ هل يمكن للبيانات أن تخبرك بما لا يعرفه العملاء أنهم يريدونه؟</li>
    <li>كيف توازن Netflix بين "خوارزمية التوصية" و"المخاطرة الإبداعية"؟</li>
  </ul>
  <h4>3. الثقافة التنظيمية للابتكار</h4>
  <ul>
    <li>وثيقة "ثقافة Netflix" الشهيرة: "الحرية والمسؤولية." كيف تمكن هذه الفلسفة الابتكار السريع؟</li>
    <li>"اختبار الحارس" — هل ستحارب للإبقاء على هذا الموظف؟ كيف ترتبط كثافة المواهب بالابتكار؟</li>
    <li>هل يمكن نقل ثقافة Netflix إلى ثقافات وطنية مختلفة (مثلاً السعودية) دون أن تفقد جوهرها؟</li>
  </ul>
  <h4>4. التموضع التنافسي</h4>
  <ul>
    <li>مع دخول Disney+ و HBO Max و Apple TV+ السوق، هل "خندق" Netflix قابل للدفاع عنه؟ ما مصدر ميزتها التنافسية الحقيقية؟</li>
    <li>هل إدخال Netflix للإعلانات (2022) يمثل ابتكاراً أم تراجعاً استراتيجياً؟</li>
    <li>كيف يجب أن تستجيب Netflix لتهديد المحتوى المُنتج بالذكاء الاصطناعي؟</li>
  </ul>

  <h3>الأطر الاستراتيجية الرئيسية</h3>
  <ul>
    <li><b>الابتكار المُدمّر (كريستنسن):</b> كيف تستهدف Netflix الأسواق المتجاهلة ثم ترتقي إلى الأعلى — من DVD (سوق مهمل) إلى البث (تعطيل التلفزيون الكبلي) إلى المحتوى الأصلي (تعطيل هوليوود).</li>
    <li><b>منحنى-S للابتكار:</b> حدد منحنى-S لكل من DVD والبث والمحتوى الأصلي. أين Netflix على كل منحنى؟</li>
    <li><b>استراتيجية المحيط الأزرق:</b> كيف خلقت Netflix مساحة سوقية جديدة — البث حسب الطلب بدون إعلانات — بدلاً من منافسة التلفزيون الكبلي مباشرة؟</li>
    <li><b>نظرية قدرة الامتصاص:</b> كيف تبني Netflix قدرتها على استيعاب التكنولوجيا الجديدة (AI، الألعاب، التفاعلية) في عملياتها الأساسية؟</li>
  </ul>

  <h3>الأهداف التعليمية</h3>
  <ul>
    <li>فهم مفهوم "تدمير الذات" كاستراتيجية ابتكارية — ولماذا تفشل معظم المؤسسات في تطبيقه.</li>
    <li>تحليل العلاقة بين الثقافة التنظيمية (الحرية والمسؤولية) والقدرة على الابتكار المتكرر.</li>
    <li>تقييم دور البيانات الضخمة في اتخاذ القرارات الإبداعية — حدودها وإمكانياتها.</li>
    <li>تطبيق دروس Netflix في الابتكار والتحول الرقمي على المؤسسات التقليدية في حائل.</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    أنت الرئيس التنفيذي لشركة ناجحة. نموذج عملك الحالي يطبع النقود. لكنك ترى تقنية جديدة ستجعله عتيقاً خلال 5-10 سنوات. التحول إلى النموذج الجديد سيدمر أرباحك الحالية وقد يفشل. البقاء على النموذج الحالي يعني أرباحاً مضمونة الآن — وموتاً محتوماً لاحقاً.<br><br>
    <b>متى تقرر تدمير نموذج عملك الناجح؟ وكيف تقنع مجلس الإدارة والمساهمين بذلك؟</b>
  </div>

  <h3>التطبيق المحلي: التحول الرقمي في حائل</h3>
  <ul>
    <li><b>قطاع التجزئة التقليدي في حائل:</b> معظم متاجر التجزئة في حائل تعتمد على نماذج تقليدية. كيف يمكن لتاجر أقمشة أو عطور في سوق برزان أن "يدمر" نموذجه التقليدي ويتبنى التجارة الإلكترونية والتوصيل للمنازل؟</li>
    <li><b>قطاع الزراعة:</b> مزارع التمور والحبوب في حائل تعمل بنماذج إنتاجية تقليدية. ما "الابتكار المُدمّر" الذي يمكن أن يحول هذا القطاع (زراعة ذكية، أسواق رقمية مباشرة للمستهلك)؟</li>
    <li><b>قطاع الضيافة:</b> الفنادق والمطاعم التقليدية في حائل — كيف تدمج نماذج الحجز الرقمي وبرامج الولاء والتوصيل دون أن تدمر تجربة الضيافة الشخصية التي تميزها؟</li>
    <li><b>رؤية 2030 والتحول الرقمي:</b> كيف تتماشى استراتيجية "تدمير الذات" مع أهداف التحول الرقمي في رؤية 2030؟</li>
  </ul>

  <h3>الواجب التحضيري</h3>
  <ul>
    <li>اقرأ عرض "ثقافة Netflix" المكون من 127 شريحة. حدد المبادئ الثلاثة التي يمكن تطبيقها فوراً في بيئة العمل السعودية.</li>
    <li>حدد نشاطاً تجارياً واحداً في حائل (متجر، مطعم، مزرعة) واسأل: ما "التدمير الذاتي" الذي يمكن أن يقوم به هذا النشاط قبل أن يفعله منافس؟</li>
    <li>جهز موقفك: هل الأفضل أن تكون المُدمِّر أم المُدمَّر؟ ولماذا لا تستطيع معظم الشركات أن تكون المُدمِّر؟</li>
  </ul>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: Netflix S-1؛ هاستينغز وماير (2020) No Rules Rules؛ Harvard Business Review</span>
  </div>
</div>`,
  },

  // ==================== Google Project Aristotle — HR ====================
  {
    filename: 'Google_Aristotle_HR_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>Google Project Aristotle: ما الذي يصنع فريقاً عالي الأداء فعلاً؟</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>Google — قسم تحليلات الأفراد (People Analytics)</td></tr>
    <tr><td class="label">الصناعة</td><td>التكنولوجيا / إدارة الموارد البشرية</td></tr>
    <tr><td class="label">المشروع</td><td>Project Aristotle (2012–2016)</td></tr>
    <tr><td class="label">المقر الرئيسي</td><td>ماونتن فيو، كاليفورنيا، الولايات المتحدة</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>180+ فريق تمت دراستهم؛ 250+ صفة تم تحليلها؛ آلاف المقابلات؛ 4 سنوات من البحث</td></tr>
    <tr><td class="label">محور الدراسة</td><td>الموارد البشرية — ديناميكيات الفريق والأمان النفسي</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>فهم العوامل التي تصنع فرقاً عالية الأداء — ولماذا "تجميع النجوم" لا يضمن النجاح</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>في عام 2012، أطلقت Google مشروعاً طموحاً أسمته Project Aristotle — تيمناً بمقولة الفيلسوف الإغريقي: "الكل أعظم من مجموع أجزائه." السؤال كان بسيطاً لكنه عميق: ما الذي يجعل بعض الفرق في Google تنجح بينما تفشل أخرى — بالرغم من تساوي المواهب والموارد؟ درس فريق People Analytics بقيادة جوليا روزوفسكي 180 فريقاً من فرق Google — مهندسين ومبيعات ومديري منتجات — وحللوا أكثر من 250 صفة. توقعوا أن يجدوا أن "أفضل الفرق تضم أفضل الأفراد." كانوا مخطئين تماماً.</p>
  <p>النتيجة التي هزت عالم الأعمال: العامل الأول ليس من هم في الفريق، بل كيف يعمل الفريق معاً. على وجه التحديد، العامل الأكثر أهمية هو "الأمان النفسي" — الإيمان بأن أعضاء الفريق لن يعاقبوك أو يهينوك على التحدث بأفكار أو أسئلة أو مخاوف أو أخطاء. الفرق ذات الأمان النفسي العالي تؤدي أداءً أفضل في كل المقاييس: إيرادات أكثر، دوران موظفين أقل، أفكار أكثر ابتكاراً، تقييمات أفضل من المديرين التنفيذيين.</p>
  <p>الأمر الأكثر إثارة للدهشة هو ما لم يهم. لم تكن الصداقات خارج العمل مهمة. لم يكن العمل من نفس المكتب مهماً. لم يكن وجود مدير واحد قوي مهماً بالضرورة. ما يهم هو خلق بيئة يشعر فيها الجميع بالأمان للمخاطرة والضعف والصراحة. الفرق التي ارتكبت أخطاء أكثر كانت في الواقع الفرق الأعلى أداءً — لأنها كانت الفرق الوحيدة التي تجرؤ على ارتكاب الأخطاء.</p>

  <h3>الخلفية والتاريخ</h3>
  <p>لطالما كانت Google مهووسة بالبيانات في كل شيء — من خوارزميات البحث إلى اختيار ظل اللون الأزرق لروابط الإعلانات. لكن مشروع Project Aristotle مثّل تحدياً فريداً: كيف تقيس شيئاً غير ملموس مثل "كيمياء الفريق"؟ جمع الفريق استبيانات وبيانات أداء ومقابلات عبر أربع سنوات، باحثاً عن أنماط. بدأ الفرضية واضحة: أفضل الفرق تضم أفضل الأفراد — أكثرهم خبرة، أعلى معدل ذكاء، أبرعهم تقنياً. لكن البيانات رفضت هذه الفرضية مراراً. بعض أفضل المهندسين في Google وضعوا في فرق معاً وأنتجوا متوسط الأداء. بينما فرق تضم أعضاء "متوسطين" تفوقت باستمرار.</p>
  <p>كان الاكتشاف العظيم للأمان النفسي مستوحى من بحث إيمي إدموندسون، أستاذة القيادة في كلية هارفارد للأعمال، التي صاغت المصطلح عام 1999. وجدت إدموندسون في دراستها للفرق الطبية أن الفرق الأعلى أداءً لم تكن هي التي ارتكبت أخطاء أقل — بل كانت التي أبلغت عن أخطاء أكثر. لماذا؟ لأنها كانت الفرق الوحيدة التي شعرت بالأمان الكافي للإبلاغ عن الأخطاء. الفرق ذات الأمان النفسي المنخفض كانت ترتكب نفس الأخطاء مراراً — لكنها كانت تخفيها.</p>
  <p>بالإضافة إلى الأمان النفسي، حدد Google أربعة عوامل أخرى: الاعتمادية (الوفاء بالالتزامات في الوقت المحدد)، وضوح الهيكل والأهداف (أدوار واضحة وخطط وأهداف)، المعنى (الشعور بأن العمل مهم شخصياً)، والتأثير (الاعتقاد بأن عمل الفريق يحدث فرقاً). لكن الأمان النفسي كان الأساس الذي تقوم عليه العوامل الأخرى جميعاً.</p>
</div>

<div class="page">
  <div class="page-header">دراسة حالة: Google Project Aristotle — الصفحة 2 من 2</div>

  <table class="data">
    <thead><tr><th>الديناميكية</th><th>التعريف</th><th>التأثير النسبي</th></tr></thead>
    <tbody>
      <tr><td>1. الأمان النفسي</td><td>الشعور بالأمان للمخاطرة والضعف أمام الفريق</td><td>★★★ (الأهم)</td></tr>
      <tr><td>2. الاعتمادية</td><td>الوفاء بالالتزامات في الوقت المحدد وبجودة عالية</td><td>★★★</td></tr>
      <tr><td>3. وضوح الهيكل والأهداف</td><td>أدوار وخطط وأهداف واضحة ومحددة</td><td>★★</td></tr>
      <tr><td>4. المعنى</td><td>الشعور بأن العمل مهم شخصياً لهوية العضو</td><td>★★</td></tr>
      <tr><td>5. التأثير</td><td>الاعتقاد بأن عمل الفريق يحدث فرقاً حقيقياً</td><td>★★</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. الأمان النفسي</h4>
  <ul>
    <li>كيف تعرف أن فريقك يتمتع بأمان نفسي عالٍ؟ ما المؤشرات السلوكية الملاحظة؟</li>
    <li>كيف يبني القائد الأمان النفسي في فريق جديد؟ أعطِ ثلاث ممارسات محددة.</li>
    <li>في الثقافات الهرمية (مثل بعض بيئات العمل العربية)، هل يمكن بناء أمان نفسي دون تقويض احترام السلطة؟</li>
  </ul>
  <h4>2. التوظيف وتكوين الفريق</h4>
  <ul>
    <li>بعد Project Aristotle، هل يجب على Google تغيير طريقة توظيفها؟ هل توظف من أجل "الموهبة" أم "قابلية العمل الجماعي"؟</li>
    <li>نظرية "تجميع النجوم": لماذا تفشل فرق تضم أفضل المواهب الفردية أحياناً؟</li>
    <li>كيف توازن بين التنوع المعرفي (أفكار مختلفة) والأمان النفسي (راحة للتحدث)؟</li>
  </ul>
  <h4>3. القياس والتقييم</h4>
  <ul>
    <li>كيف تقيس "الأمان النفسي" في مؤسستك؟ ما المقاييس الكمية والنوعية؟</li>
    <li>هل يمكن تطبيق نتائج Project Aristotle خارج Google — في صناعات غير تقنية مثل الزراعة أو الضيافة؟</li>
  </ul>
  <h4>4. القيادة والثقافة</h4>
  <ul>
    <li>ما دور القائد في خلق الأمان النفسي مقابل دور أعضاء الفريق؟ هل يتحمل القائد مسؤولية أكبر؟</li>
    <li>كيف تتعامل مع عضو فريق يدمر الأمان النفسي — بالنقد العلني أو السخرية أو إخفاء المعلومات؟</li>
    <li>هل يمكن أن يكون هناك "أمان نفسي أكثر من اللازم" يؤدي إلى التساهل وعدم المساءلة؟</li>
  </ul>

  <h3>الأطر الرئيسية</h3>
  <ul>
    <li><b>نموذج الأمان النفسي (إدموندسون):</b> الأبعاد الأربعة — أمان التحدث، أمان التعلم، أمان المساهمة، أمان تحدي الوضع الراهن.</li>
    <li><b>مراحل تاكمان لتطور الفريق:</b> التشكيل، العصف، التوحيد، الأداء، الانتهاء — وأين يلعب الأمان النفسي دوراً حاسماً.</li>
    <li><b>نظرية التبادل الاجتماعي:</b> كيف تبني السلوكيات الصغيرة (الاستماع، الاعتراف بالخطأ، طرح الأسئلة) الثقة التراكمية.</li>
    <li><b>نظرية Belbin لأدوار الفريق:</b> كيف تكمل الأدوار المختلفة بعضها — ولماذا تحتاج الفرق لـ "منهي" و"منسق" بقدر حاجتها لـ "مبتكر."</li>
  </ul>

  <h3>الأهداف التعليمية</h3>
  <ul>
    <li>فهم أن أداء الفريق لا تحدده المواهب الفردية فقط، بل ديناميكيات الفريق — وعلى رأسها الأمان النفسي.</li>
    <li>تطوير استراتيجيات عملية لبناء الأمان النفسي في فرق العمل السعودية الناشئة.</li>
    <li>تحليل لماذا تفشل استراتيجية "تجميع أفضل المواهب" أحياناً وكيفية تجنب هذا الفخ.</li>
    <li>تطبيق نموذج Project Aristotle على فرق المشاريع الناشئة في حائل.</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    لديك ميزانية لتوظيف 3 أشخاص لمشروعك الناشئ. أمامك خياران: (أ) توظيف 3 "نجوم" — الأفضل في مجالاتهم تقنياً، بشخصيات تنافسية قوية. أو (ب) توظيف 3 أشخاص "أكفاء" بمهارات اجتماعية عالية وروح تعاونية. البيانات تقول أن الخيار (ب) قد يكون أكثر إنتاجية. لكن مستثمريك يريدون رؤية "أفضل المواهب."<br><br>
    <b>من توظف؟ ولماذا؟</b>
  </div>

  <h3>التطبيق المحلي: بناء فرق ناشئة في حائل</h3>
  <ul>
    <li><b>مشروع ناشئ مكون من 3-5 أشخاص في حائل:</b> كيف تبني أماناً نفسياً في فريق صغير حيث يعرف الجميع بعضهم اجتماعياً؟</li>
    <li><b>الثقافة القبلية والعائلية:</b> في بيئة الأعمال الحائلية حيث تتداخل العلاقات العائلية مع المهنية، كيف توازن بين الصراحة المهنية والاحترام الاجتماعي؟</li>
    <li><b>القيادة في المشاريع الناشئة السعودية:</b> كيف يمكن لقائد سعودي شاب بناء ثقافة "الخطأ مسموح" في مجتمع يميل لتجنب الإحراج العلني؟</li>
    <li><b>رؤية 2030 وتمكين المرأة:</b> فرق مختلطة بين الجنسين في السعودية — كيف يلعب الأمان النفسي دوراً مختلفاً؟</li>
  </ul>

  <h3>الواجب التحضيري</h3>
  <ul>
    <li>فكر في أسوأ فريق عملت معه. حدد: هل كان نقص الأمان النفسي عاملاً؟ كيف تجلى ذلك؟</li>
    <li>في فريقك الحالي (أو أي فريق أنت جزء منه)، قيّم مستوى الأمان النفسي من 1-10. ما دليلك على تقييمك؟</li>
    <li>اكتب شيئاً واحداً يمكنك فعله غداً لزيادة الأمان النفسي في فريقك — سلوك محدد وقابل للتنفيذ.</li>
  </ul>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: Google re:Work؛ إدموندسون، أ. (1999) Psychological Safety؛ New York Times Magazine (2016)</span>
  </div>
</div>`,
  },

  // ==================== Theranos — Risk Management ====================
  {
    filename: 'Theranos_Risk_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>Theranos: انهيار الثقة الاستثمارية — كيف خسر المستثمرون مليار دولار</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>Theranos, Inc.</td></tr>
    <tr><td class="label">الصناعة</td><td>التكنولوجيا الصحية / التشخيص الطبي</td></tr>
    <tr><td class="label">التأسيس</td><td>2003 — إليزابيث هولمز</td></tr>
    <tr><td class="label">المقر الرئيسي</td><td>بالو ألتو، كاليفورنيا، الولايات المتحدة</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>ذروة التقييم: 9 مليار دولار (2015)؛ استثمارات مجمعة: 1.4 مليار دولار؛ شركاء: Walgreens, Safeway</td></tr>
    <tr><td class="label">محور الدراسة</td><td>إدارة المخاطر — العناية الواجبة وعلامات الخطر الاستثمارية</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>تحليل فشل آليات العناية الواجبة للمستثمرين وتحديد علامات الخطر المبكرة قبل ضخ رأس المال</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>في عام 2015، كانت إليزابيث هولمز أصغر مليارديرة عصامية في العالم — على الورق. شركتها Theranos وعدت بثورة في الطب: جهاز بحجم طابعة المكتب يمكنه إجراء 200+ اختبار دم بقطرة واحدة من الإصبع. استثمر مستثمرون مرموقون — لاري إليسون، وعائلة والتون (Walmart)، وروبرت مردوخ — أكثر من مليار دولار. دخلت Walgreens في شراكة لوضع "مراكز عافية" Theranos في صيدلياتها. المجالس كانت تضم وزيري خارجية سابقين (هنري كيسنجر وجورج شولتز) ووزير دفاع سابق (جيم ماتيس) ورئيس تنفيذي سابق لـ Wells Fargo. بدت الشركة لا تُقهر.</p>
  <p>بحلول 2018، انهار كل شيء. كشف تحقيق صحيفة Wall Street Journal أن تقنية Theranos لم تكن تعمل — كانت تجري معظم اختباراتها على أجهزة تجارية معدلة، وليس على "صندوقها السحري" Edison. النتائج كانت غير دقيقة بشكل خطير: أخطأت في تشخيص حالات سرطان وأمراض قلب وحمل. تم حل الشركة. أدينت هولمز بالاحتيال وحكم عليها بالسجن 11 عاماً. خسر المستثمرون كل شيء.</p>
  <p>كيف حدث هذا؟ لماذا لم يكتشف المستثمرون الأذكياء — بمن فيهم عائلة والتون التي بنت إمبراطورية التجزئة الأكثر نجاحاً في أمريكا — أن التكنولوجيا كانت وهمية؟ الجواب درس مؤلم في إدارة مخاطر الاستثمار: تأثير الهالة للشخصية الكاريزمية، الخوف من تفويت الفرصة، غياب العناية الواجبة التقنية، ثقافة السرية المفرطة، وتهديد المبلغين عن المخالفات.</p>

  <h3>الخلفية: صعود وسقوط إمبراطورية وهمية</h3>
  <p>أسست إليزابيث هولمز Theranos عام 2003 في سن 19 بعد أن تركت جامعة ستانفورد. الفكرة كانت ثورية: بدلاً من سحب الدم بالأنابيب والإبر — وهو ما يخيف ملايين المرضى — قطرة واحدة من الإصبع تكفي لاختبارات متعددة. ارتدت هولمز سترة سوداء على غرار ستيف جوبز وتحدثت بصوت جهيري عميق (تبين لاحقاً أنه كان مصطنعاً). صورت نفسها كرؤيوية تقنية ستعيد اختراع الطب.</p>
  <p>من البداية، كانت هناك علامات خطر: رفضت هولمز نشر أي ورقة علمية مُحكَّمة عن تقنيتها. منعت موظفيها من التواصل بين الأقسام (حتى لا يكتشفوا التناقضات). طاردت المبلغين عن المخالفات قانونياً. كلما سأل مستثمر عن كيفية عمل الجهاز، كان الجواب: "سر تجاري." لكن بدلاً من أن تثير هذه السلوكيات الشكوك، زادت من الهالة الغامضة حول الشركة. المستثمرون أرادوا تصديق القصة — قصة العبقرية الشابة التي تتحدى الصناعة.</p>
  <p>جون كاريو من Wall Street Journal كان أول من كشف الحقيقة. تحدث إلى موظفين سابقين (بعضهم خاطر بملاحقة قانونية) وكشف أن جهاز Edison كان يعطي نتائج خاطئة ومتقلبة. بدأت Walgreens في إغلاق المراكز. تدخلت هيئة تنظيم المختبرات CMS. بحلول 2018، تم حل الشركة رسمياً.</p>
</div>

<div class="page">
  <div class="page-header">دراسة حالة: Theranos — الصفحة 2 من 2</div>

  <table class="data">
    <thead><tr><th>السنة</th><th>التقييم</th><th>الحدث الرئيسي</th></tr></thead>
    <tbody>
      <tr><td>2003</td><td>—</td><td>تأسيس Theranos — هولمز في سن 19</td></tr>
      <tr><td>2010</td><td>1 مليار</td><td>جمع 92 مليون دولار من مستثمرين ملائكة</td></tr>
      <tr><td>2014</td><td>9 مليار</td><td>ذروة التقييم؛ شراكة Walgreens</td></tr>
      <tr><td>2015</td><td>9 مليار</td><td>غلاف Forbes: "أصغر مليارديرة عصامية"</td></tr>
      <tr><td>2015</td><td>ينهار</td><td>تحقيق WSJ يكشف الاحتيال</td></tr>
      <tr><td>2018</td><td>صفر</td><td>حل الشركة؛ توجيه تهم جنائية لهولمز</td></tr>
      <tr><td>2022</td><td>صفر</td><td>إدانة هولمز — 11 سنة سجن</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. فشل العناية الواجبة</h4>
  <ul>
    <li>لماذا فشل مستثمرون أذكياء ومتمرسون في اكتشاف أن تقنية Theranos كانت وهمية؟ ما العوامل النفسية والتنظيمية التي ساهمت في ذلك؟</li>
    <li>ما هي "قواعد العناية الواجبة" التي كان يجب على مستثمري Theranos اتباعها قبل الاستثمار؟</li>
    <li>لو كنت مستثمراً في 2014، ما الأسئلة الثلاثة التي كنت ستطرحها على هولمز لكشف الحقيقة؟</li>
  </ul>
  <h4>2. علامات الخطر المبكرة</h4>
  <ul>
    <li>حدد 5 علامات خطر مبكرة في Theranos كان يمكن للمستثمرين ملاحظتها قبل فوات الأوان.</li>
    <li>ثقافة "السرية المطلقة" — متى تكون السرية مشروعة في شركة ناشئة، ومتى تصبح علامة خطر؟</li>
    <li>كيف تفرق بين "رؤية جريئة" و"كذبة متقنة" عند تقييم شركة ناشئة؟</li>
  </ul>
  <h4>3. دور الشخصية الكاريزمية</h4>
  <ul>
    <li>ما هو "تأثير الهالة" في الاستثمار، وكيف استغلته هولمز لجذب المستثمرين؟</li>
    <li>لماذا كان مجلس إدارة مليء بالشخصيات السياسية (كيسنجر، شولتز، ماتيس) بدلاً من خبراء طبيين؟ ماذا يقول هذا عن حوكمة الشركة؟</li>
    <li>كيف تحمي نفسك كمستثمر من الانبهار بالشخصية الكاريزمية للمؤسس؟</li>
  </ul>
  <h4>4. حماية المبلغين</h4>
  <ul>
    <li>واجه موظفو Theranos السابقون الذين كشفوا الاحتيال تهديدات قانونية وضغوطاً نفسية هائلة. كيف تحسن بيئة الأعمال حماية المبلغين عن المخالفات؟</li>
    <li>في السياق السعودي، ما آليات الإبلاغ عن المخالفات المتاحة؟ هل هي كافية؟</li>
    <li>كموظف، لو اكتشفت احتيالاً في شركتك — هل تبلغ عنه؟ ما الاعتبارات التي تزنها؟</li>
  </ul>

  <h3>الأطر الرئيسية</h3>
  <ul>
    <li><b>نموذج العناية الواجبة المكون من 5Cs:</b> الشخصية (Character)، القدرة (Capacity)، رأس المال (Capital)، الضمانات (Collateral)، الظروف (Conditions) — وكيف فشلت جميعها في حالة Theranos.</li>
    <li><b>مصفوفة المخاطر (Probability × Impact):</b> كيف تقيم مخاطر الاحتيال في الاستثمارات المبكرة.</li>
    <li><b>تحليل ما قبل الوفاة (Pre-Mortem):</b> تقنية لتخيل فشل المشروع قبل بدايته لكشف نقاط الضعف الخفية.</li>
    <li><b>نموذج الوكالة:</b> تضارب المصالح بين المؤسسين والمستثمرين — ولماذا يخفي المؤسسون المعلومات السلبية.</li>
  </ul>

  <h3>الأهداف التعليمية</h3>
  <ul>
    <li>تطوير إطار منهجي للعناية الواجبة في الاستثمارات المبكرة.</li>
    <li>تعلم كيفية التعرف على "علامات الخطر" في الشركات الناشئة قبل فوات الأوان.</li>
    <li>فهم العوامل النفسية (تأثير الهالة، الخوف من التفويت) التي تشوش حكم المستثمرين.</li>
    <li>تطبيق دروس Theranos على فرص الاستثمار في الشركات الناشئة في حائل.</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    أنت مستثمر تجلس أمام مؤسس كاريزماتي يعرض "تقنية ثورية." الادعاءات ضخمة. العروض التوضيحية مقنعة. لكنه يرفض مشاركة البيانات التقنية التفصيلية بحجة "السرية التجارية." مستثمرون آخرون يضخون الملايين. الضغط للاستثمار هائل — إذا نجحت التقنية، ستحقق عوائد خيالية. لكن إذا كانت وهمية، ستخسر كل شيء.<br><br>
    <b>كيف تقرر؟ وما السؤال الواحد الذي إذا رفض الإجابة عنه تنسحب فوراً؟</b>
  </div>

  <h3>التطبيق المحلي: العناية الواجبة في السوق السعودي</h3>
  <ul>
    <li><b>فرص الشركات الناشئة في حائل:</b> كيف تطبق إطاراً للعناية الواجبة على شركة ناشئة محلية — مثلاً في الزراعة التقنية أو السياحة البيئية؟ ما الوثائق التي تطلبها؟</li>
    <li><b>المنح والقروض الحكومية:</b> مع زيادة برامج التمويل الحكومي (بنك التنمية الاجتماعية، منشآت)، كيف تحمي هذه الجهات نفسها من احتيال مشابه لـ Theranos؟</li>
    <li><b>الاستثمار العائلي:</b> في السوق السعودي، غالباً ما تستثمر العائلات في مشاريع أقاربها بناءً على الثقة الشخصية. كيف تطبق العناية الواجبة المهنية دون الإضرار بالعلاقات العائلية؟</li>
    <li><b>حوكمة الشركات في السعودية:</b> ما الدروس المستفادة من Theranos لتحسين حوكمة الشركات الناشئة في المملكة؟</li>
  </ul>

  <h3>الواجب التحضيري</h3>
  <ul>
    <li>شاهد الفيلم الوثائقي The Inventor: Out for Blood in Silicon Valley على HBO/YouTube.</li>
    <li>ابحث عن فرصة استثمارية واحدة معروضة حالياً في السعودية. طبق "قائمة تدقيق العناية الواجبة" المكونة من 5 نقاط. ما النتيجة؟</li>
    <li>فكر في موقف تعرضت فيه لـ "تأثير الهالة" — شخص أو شركة بدت مثالية ثم تبين أنها أقل من ذلك بكثير. ماذا تعلمت؟</li>
  </ul>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: Carreyrou, J. (2018) Bad Blood؛ SEC Complaint 2018؛ DOJ Indictment</span>
  </div>
</div>`,
  },

  // ==================== IKEA — International Expansion ====================
  {
    filename: 'IKEA_Expansion_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>IKEA: التوسع الدولي — موازنة المعيار العالمي مع التكيف المحلي</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>IKEA (إنتر إيكيا سيستمز بي.في.)</td></tr>
    <tr><td class="label">الصناعة</td><td>تجزئة الأثاث والمفروشات المنزلية</td></tr>
    <tr><td class="label">التأسيس</td><td>1943 — إنغفار كامبراد (السويد)</td></tr>
    <tr><td class="label">المقر الرئيسي</td><td>دلفت، هولندا</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>الإيرادات 2023: 47.6 مليار يورو | 460+ متجراً في 62 دولة | 231,000 موظف</td></tr>
    <tr><td class="label">محور الدراسة</td><td>التوسع الدولي — استراتيجية التكيف المحلي مقابل التوحيد العالمي</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>تحليل كيف توازن شركة عالمية بين هوية علامتها التجارية الموحدة ومتطلبات التكيف مع الأسواق المحلية</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>في عام 1986، دخلت IKEA السوق الأمريكية بثقة مطلقة. الأثاث السويدي البسيط والعملي وبأسعار معقولة — من لن يحب ذلك؟ الأمريكان، كما تبين. اشتكى العملاء من أن أكواب الشرب صغيرة جداً ("تضعون فيها مكعبات ثلج أكثر من الماء!"). الأرفف كانت ضيقة جداً لأجهزة التلفاز الأمريكية الضخمة. الأسرة كانت بمقاسات سنتيمترية لا تناسب الفراش الأمريكي. والأسوأ: لم تقدم IKEA خدمة التوصيل — كان على الزبائن نقل الأثاث بأنفسهم. في بلد السيارات الكبيرة والمسافات الطويلة، كان هذا غير مقبول. فشلت IKEA فشلاً ذريعاً في أمريكا. كادت تنسحب.</p>
  <p>لكن IKEA تعلمت. بدلاً من الإصرار على "الطريقة السويدية أو لا شيء"، قامت بتكييف منتجاتها وعملياتها مع السوق الأمريكية دون التخلي عن هويتها الأساسية. صنعت أكواباً أكبر. غيرت مقاسات الأسرة إلى البوصات. أضافت خدمة التوصيل والتجميع. عدلت تشكيلة المطابخ لتناسب أحجام الثلاجات الأمريكية والأفران المزدوجة. النتيجة: بحلول 2023، أصبحت أمريكا أكبر سوق لـ IKEA.</p>
  <p>في المقابل، عندما دخلت IKEA اليابان لأول مرة عام 1974، فشلت لأن اليابانيين — المعتادين على أثاث عالي الجودة مع خدمة توصيل بيضاء القفازات — وجدوا نموذج "افعلها بنفسك" غير مقبول. انسحبت IKEA من اليابان وظلت غائبة 30 عاماً. عندما عادت عام 2006، دخلت بنموذج معدل يناسب التوقعات اليابانية مع الحفاظ على روح IKEA. هذه المرة نجحت.</p>
  <p>تتناول هذه الحالة المعضلة الكلاسيكية في الأعمال الدولية: "المعيار العالمي" مقابل "التكيف المحلي." متى تتمسك باتساق علامتك التجارية العالمية؟ ومتى تتكيف لتنجح في سوق محلي مختلف تماماً؟</p>

  <h3>الخلفية والتاريخ</h3>
  <p>أسس إنغفار كامبراد IKEA في سن 17 في ريف السويد. الاسم اختصار: Ingvar Kamprad من Elmtaryd, Agunnaryd (المزرعة والقرية التي نشأ فيها). بدأ ببيع أعواد الثقاب بالبريد، ثم تدرج إلى الأثاث. الفلسفة كانت سويدية أصيلة: البساطة، الوظيفية، إمكانية الوصول للجميع. التصميم الديمقراطي — أثاث جميل وعملي بأسعار يستطيع "الكثيرون" تحملها.</p>
  <p>النموذج التجاري كان مبتكراً: الأثاث المسطح (الذي يجمعه العميل بنفسه) يخفض تكاليف الشحن والتخزين والعمالة بشكل هائل. المتجر كوجهة — مطعم يقدم الكرات السويدية الشهيرة (Köttbullar)، ومنطقة ألعاب للأطفال (Småland) تشجع العائلات على البقاء لساعات. كان متجر IKEA النموذجي مستودعاً أزرق وأصفر ضخماً على أطراف المدينة مع مسار إجباري أحادي الاتجاه يأخذك عبر غرف عرض مرتبة بالكامل.</p>
  <p>مع توسع IKEA عالمياً، واجهت معضلة متكررة: هل "الطريقة السويدية" قابلة للنقل عالمياً؟ بعض عناصر النموذج كانت عالمية حقاً — التصميم الاسكندنافي البسيط يجذب الجميع. لكن عناصر أخرى كانت سويدية بشكل لا ينفصل: توقعات "التجميع الذاتي"، أحجام المنتجات، تفضيلات الطعام، معايير الخدمة.</p>
</div>

<div class="page">
  <div class="page-header">دراسة حالة: IKEA — الصفحة 2 من 2</div>

  <table class="data">
    <thead><tr><th>البلد</th><th>سنة الدخول</th><th>النتيجة</th><th>التكيفات الرئيسية</th></tr></thead>
    <tbody>
      <tr><td>السويد</td><td>1958</td><td>نجاح</td><td>السوق الأصلي — النموذج الأساسي</td></tr>
      <tr><td>الولايات المتحدة</td><td>1985</td><td>فشل → نجاح</td><td>أكواب أكبر، مقاسات إمبراطورية، خدمة توصيل</td></tr>
      <tr><td>اليابان</td><td>1974→2006</td><td>فشل → نجاح</td><td>توصيل أبيض القفازات، شقق صغيرة، أثاث متعدد الوظائف</td></tr>
      <tr><td>الصين</td><td>1998</td><td>نجاح</td><td>أسعار أقل، متاجر في مركز المدن، أثاث يناسب الشقق الصغيرة</td></tr>
      <tr><td>السعودية</td><td>1983</td><td>نجاح</td><td>فصل العائلات، احترام أوقات الصلاة، تكيف المطعم</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. المعيار العالمي مقابل التكيف المحلي</h4>
  <ul>
    <li>ما الذي يجب أن يظل موحداً عالمياً في أي علامة تجارية، وما الذي يجب تكييفه محلياً؟ استخدم IKEA كمثال.</li>
    <li>أين ترسم IKEA الخط الفاصل بين التكيف الضروري (مقاسات الأسرة الأمريكية) والتكيف المفرط (فقدان الهوية السويدية)؟</li>
    <li>هل يمكن لشركة أن تكون "محلية جداً" لدرجة أنها تفقد ميزة كونها علامة تجارية عالمية؟</li>
  </ul>
  <h4>2. الفشل الدولي والتعافي</h4>
  <ul>
    <li>لماذا فشلت IKEA في أمريكا واليابان في البداية؟ هل كانت الأسباب واحدة أم مختلفة؟</li>
    <li>ما الذي غيرته IKEA بين محاولتها الأولى والثانية في اليابان؟</li>
    <li>كيف تعرف متى تنسحب من سوق ومتى تثابر مع التعديلات؟</li>
  </ul>
  <h4>3. نموذج الأعمال والنقل الدولي</h4>
  <ul>
    <li>نموذج "التجميع الذاتي" — هل هو ميزة تنافسية عالمية أم حاجز ثقافي؟</li>
    <li>كيف تتعامل IKEA مع اختلاف توقعات الخدمة بين الأسواق (السويد: الخدمة الذاتية، اليابان: خدمة فائقة)؟</li>
    <li>قارن استراتيجية IKEA للتوسع الدولي مع استراتيجية كنتاكي أو ماكدونالدز. من الأكثر تكيفاً محلياً؟</li>
  </ul>
  <h4>4. التوسع الخليجي</h4>
  <ul>
    <li>IKEA نجحت في السعودية منذ 1983. ما التكيفات التي قامت بها للسوق السعودي؟ وكيف توازن بين قيمها السويدية والقيم الإسلامية؟</li>
    <li>لو كنت تخطط لتوسيع نشاط تجاري من حائل إلى أسواق خليجية أخرى (الكويت، البحرين، الإمارات)، هل ستحتاج إلى تكييفات مختلفة لكل سوق أم استراتيجية خليجية موحدة؟</li>
    <li>ماذا يمكن للشركات السعودية أن تتعلمه من IKEA للتوسع في الأسواق العالمية؟</li>
  </ul>

  <h3>الأطر الرئيسية</h3>
  <ul>
    <li><b>إطار CAGE للمسافة:</b> الاختلافات الثقافية (Cultural)، الإدارية/السياسية (Administrative)، الجغرافية (Geographic)، والاقتصادية (Economic) بين الأسواق.</li>
    <li><b>نموذج أوبسالا للتدويل:</b> التوسع التدريجي من الأسواق القريبة نفسياً إلى الأسواق البعيدة.</li>
    <li><b>استراتيجيات دخول السوق:</b> مقارنة بين الترخيص والامتياز والمشروع المشترك والملكية الكاملة — متى تستخدم أياً منها؟</li>
  </ul>

  <h3>الأهداف التعليمية</h3>
  <ul>
    <li>فهم المفاضلة بين التوحيد العالمي والتكيف المحلي في استراتيجية التوسع الدولي.</li>
    <li>تحليل أسباب فشل الشركات العالمية في أسواق معينة واستراتيجيات تعافيها.</li>
    <li>تطبيق إطار CAGE لتقييم فرص التوسع من حائل إلى أسواق خليجية وعربية.</li>
    <li>استخلاص دروس عملية لتوسيع المشاريع السعودية الناشئة خارج السوق المحلي.</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    نشاطك التجاري نجح في حائل. تريد التوسع إلى الرياض أو دبي. لكن ما نجح في حائل — الأسعار، الخدمة، المنتجات — قد لا ينجح هناك. إذا تمسكت بنموذجك الأصلي بالكامل، قد تفشل. وإذا تكيفت أكثر من اللازم، قد تفقد ما جعلك مميزاً في المقام الأول.<br><br>
    <b>ما الذي تغيره؟ وما الذي تتمسك به مهما كلف الأمر؟</b>
  </div>

  <h3>التطبيق المحلي: توسع المشاريع الحائلية إلى أسواق خليجية</h3>
  <ul>
    <li><b>مقهى أو مطعم حائلي يتوسع إلى الرياض:</b> كيف تحافظ على "الطابع الحائلي" الذي يميزك بينما تتكيف مع أذواق سكان العاصمة؟</li>
    <li><b>منتج زراعي حائلي (تمور، عسل، أعشاب):</b> كيف تسوق منتجاً زراعياً محلياً في أسواق خليجية تنافسية؟ ما "القصة" التي ترويها؟</li>
    <li><b>التجارة الإلكترونية:</b> كيف تبيع منتجات حائلية عبر الإنترنت لأسواق خليجية؟ ما تحديات الشحن والتوصيل والدفع؟</li>
    <li><b>رؤية 2030 والتجارة البينية الخليجية:</b> كيف تستفيد من سياسات التكامل الاقتصادي الخليجي لتوسيع نشاطك؟</li>
  </ul>

  <h3>الواجب التحضيري</h3>
  <ul>
    <li>اختر نشاطاً تجارياً واحداً في حائل. ارسم خطة توسع إلى سوق خليجي واحد باستخدام إطار CAGE.</li>
    <li>اذهب إلى أقرب فرع IKEA (في الرياض أو جدة) ولاحظ التكيفات المحلية. سجل 5 أشياء مختلفة عن "IKEA السويدية القياسية."</li>
    <li>اسأل صاحب عمل محلي: هل فكرت في التوسع خارج حائل؟ ما الذي يمنعك؟</li>
  </ul>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: IKEA Annual Report 2023؛ Harvard Business School Case 9-716-458؛ Inter IKEA Systems</span>
  </div>
</div>`,
  },

  // ==================== J&J — Crisis Management ====================
  {
    filename: 'JnJ_Crisis_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>Johnson & Johnson: أزمة تايلينول 1982 — المعيار الذهبي لإدارة الأزمات</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>Johnson & Johnson</td></tr>
    <tr><td class="label">الصناعة</td><td>الأدوية والمنتجات الاستهلاكية الصحية</td></tr>
    <tr><td class="label">التأسيس</td><td>1886 — روبرت وود جونسون الأول</td></tr>
    <tr><td class="label">المقر الرئيسي</td><td>نيو برونزويك، نيوجيرسي، الولايات المتحدة</td></tr>
    <tr><td class="label">المنتج</td><td>تايلينول (أسيتامينوفين) — مسكن الألم الأكثر مبيعاً في أمريكا</td></tr>
    <tr><td class="label">الأزمة</td><td>7 وفيات بسبب تسمم بالسيانيد في شيكاغو — سبتمبر-أكتوبر 1982</td></tr>
    <tr><td class="label">محور الدراسة</td><td>إدارة الأزمات — الاتصال، استدعاء المنتجات، وحماية السمعة</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>تحليل استراتيجية استجابة لازمة حافظت على علامة تجارية بدلاً من تدميرها</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>في صباح 29 سبتمبر 1982، تلقت شرطة شيكاغو بلاغاً مروعاً: ثلاثة أشخاص ماتوا فجأة بعد تناول كبسولات تايلينول. السبب: سيانيد البوتاسيوم — سم قاتل بجرعة ميكروسكوبية. بحلول نهاية الأسبوع، ارتفع العدد إلى سبع وفيات. انتشر الذعر في جميع أنحاء أمريكا. كان تايلينول يمثل 17% من إيرادات Johnson & Johnson و35% من أرباحها. حصتها السوقية في مسكنات الألم 37%. بين عشية وضحاها، انهارت إلى 7%. توقع كل خبير تسويق أن تايلينول قد انتهى — علامة تجارية ميتة إلى الأبد.</p>
  <p>لكن ما حدث بعد ذلك أصبح المثال الأكاديمي الكلاسيكي في إدارة الأزمات. قامت Johnson & Johnson بشيء لم يسبق لأي شركة أن فعلته: سحبت 31 مليون عبوة من تايلينول من جميع أرفف المتاجر في أمريكا — ليس فقط في شيكاغو، بل على مستوى البلاد. التكلفة: أكثر من 100 مليون دولار (ما يعادل 300 مليون دولار اليوم). أوقفت كل إعلانات تايلينول فوراً. أرسلت 450,000 رسالة للأطباء والمستشفيات تحذرهم. أنشأت خطاً ساخناً للمستهلكين على مدار الساعة. والأهم: خرج رئيسها التنفيذي جيمس بيرك في مقابلات تلفزيونية مباشرة معرباً عن أسفه وشفافيته الكاملة — لا حيل علاقات عامة، لا تهرب، لا إلقاء لوم على "مختل عقلي خارجي."</p>
  <p>في غضون أشهر، أعادت Johnson & Johnson إطلاق تايلينول بعبوة ثلاثية الأمان — أول عبوة مقاومة للعبث في الصناعة. خلال عام، استعاد تايلينول حصته السوقية بالكامل. لم تدمر الأزمة العلامة التجارية — بل جعلتها أقوى وأكثر مصداقية.</p>

  <h3>الخلفية</h3>
  <p>قبل الأزمة، كان تايلينول قصة نجاح مذهلة. بدأ كدواء موصوف طبيباً، وتحول إلى منتج بدون وصفة طبية عام 1959. بحلول 1982، كان يستخدمه 100 مليون أمريكي. كانت Johnson & Johnson شركة محترمة ذات سمعة طيبة في الجودة والسلامة.</p>
  <p>كان قرار سحب 31 مليون عبوة مثيراً للجدل داخل الشركة. مستشارو إدارة الغذاء والدواء ومكتب التحقيقات الفيدرالي نصحوا بعدم السحب الشامل — قالوا إنه سيشجع "المقلدين" وسيكلف ثروة. لكن بيرك استند إلى "عقيدتنا" (Our Credo) — وثيقة القيم المؤسسية لـ J&J التي كُتبت عام 1943 والتي تضع مسؤولية الشركة تجاه "الأطباء والممرضات والمرضى والأمهات والآباء" أولاً. كانت العقيدة هي البوصلة الأخلاقية التي وجهت كل قرار.</p>
  <p>تبين أن التسمم كان عملاً إجرامياً قام به شخص مجهول (لم يُقبض عليه قط) قام بحقن السيانيد في كبسولات على أرفف المتاجر في شيكاغو. لم تكن Johnson & Johnson مذنبة بأي إهمال. ومع ذلك، تصرفت كما لو كانت مسؤولة بالكامل — ليس لأن القانون أجبرها، بل لأن عقيدتها طالبت بذلك.</p>
</div>

<div class="page">
  <div class="page-header">دراسة حالة: Johnson & Johnson — الصفحة 2 من 2</div>

  <table class="data">
    <thead><tr><th>التاريخ</th><th>الحدث</th><th>الإجراء</th></tr></thead>
    <tbody>
      <tr><td>29 سبتمبر 1982</td><td>أول 3 وفيات في شيكاغو</td><td>تحذير فوري للمستهلكين في شيكاغو</td></tr>
      <tr><td>5 أكتوبر 1982</td><td>ارتفاع الوفيات إلى 7</td><td>سحب 31 مليون عبوة على مستوى البلاد (100 مليون دولار)</td></tr>
      <tr><td>أكتوبر 1982</td><td>ذروة الذعر الإعلامي</td><td>مقابلات تلفزيونية مباشرة لـ جيمس بيرك</td></tr>
      <tr><td>نوفمبر 1982</td><td>إعادة الإطلاق</td><td>عبوة ثلاثية الأمان — الأولى في الصناعة</td></tr>
      <tr><td>1983</td><td>استعادة الحصة السوقية</td><td>الحصة السوقية تعود إلى مستويات ما قبل الأزمة</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. القيادة أثناء الأزمة</h4>
  <ul>
    <li>قارن قرار السحب الشامل مع النصيحة الرسمية بعدم السحب. كيف اتخذ بيرك القرار "الصحيح" ضد نصيحة الخبراء؟</li>
    <li>ما دور "عقيدتنا" (Our Credo) في توجيه القرارات أثناء الأزمة؟ هل كانت ستتصرف J&J بنفس الطريقة بدون هذه العقيدة؟</li>
    <li>بيرك ظهر على التلفزيون الوطني وعبّر عن أسفه — ليس دفاعاً. لماذا كانت الشفافية والضعف قوة وليس ضعفاً؟</li>
  </ul>
  <h4>2. استراتيجية الاتصال</h4>
  <ul>
    <li>حلل استراتيجية الاتصال الإعلامي لـ J&J: من تحدثوا معه؟ ماذا قالوا؟ بأي نبرة؟ كيف تختلف عن استراتيجيات "التحكم في الضرر" النموذجية؟</li>
    <li>في عصر وسائل التواصل الاجتماعي، كيف كانت ستختلف الأزمة؟ هل كانت استراتيجية J&J ستنجح بنفس الفعالية في 2026؟</li>
    <li>كيف تبني "رصيداً استراتيجياً من السمعة" قبل الأزمة لاستخدامه أثناء الأزمة؟</li>
  </ul>
  <h4>3. إعادة بناء الثقة</h4>
  <ul>
    <li>كيف يمكن لعلامة تجارية مرتبطة بـ 7 وفيات أن تستعيد ثقة المستهلك خلال عام واحد؟ حلل سيكولوجية المستهلك في هذه الحالة.</li>
    <li>العبوة ثلاثية الأمان — هل كانت حلاً تقنياً أم إشارة رمزية؟</li>
    <li>ما هو "تأثير التجاوز" (Overcorrection Effect) — عندما يؤدي رد الفعل المبالغ فيه للأزمة إلى زيادة الثقة بدلاً من تآكلها؟</li>
  </ul>
  <h4>4. دروس للشركات الناشئة</h4>
  <ul>
    <li>الشركات الناشئة ليس لديها "عقيدة" عمرها 40 عاماً. كيف تبني بوصلة أخلاقية لمؤسستك الناشئة من اليوم الأول؟</li>
    <li>شركة ناشئة لا تستطيع تحمل سحب منتج بقيمة 100 مليون دولار. ماذا تفعل بدلاً من ذلك في أزمة مماثلة؟</li>
    <li>هل يمكن لشركة ناشئة أن تتعافى من أزمة ثقة كما فعلت J&J بأقل من 1% من مواردها المالية؟</li>
  </ul>

  <h3>الأطر الرئيسية</h3>
  <ul>
    <li><b>نموذج كومبس للاتصال في الأزمات (SCCT):</b> أنواع الأزمات الثلاثة (ضحية، عرضية، متعمدة) واستراتيجيات الاستجابة المناسبة لكل نوع.</li>
    <li><b>دورة حياة الأزمة:</b> ما قبل الأزمة (الإشارات)، الأزمة الحادة (الاستجابة)، ما بعد الأزمة (إعادة البناء والتعلم).</li>
    <li><b>نظرية استعادة الصورة (بينوا):</b> خمس استراتيجيات لاستعادة الصورة — النفي، التهرب من المسؤولية، تقليل الهجوم، الإجراء التصحيحي، والاعتذار. أين وقعت استراتيجية J&J؟</li>
    <li><b>الساعة الذهبية الأولى:</b> كيف تحدد تصرفاتك في الساعة الأولى من الأزمة نتيجة الأزمة بأكملها؟</li>
  </ul>

  <h3>الأهداف التعليمية</h3>
  <ul>
    <li>فهم كيف يمكن للقيادة الأخلاقية السريعة والشفافة أن تحول كارثة محتملة إلى فرصة لبناء الثقة.</li>
    <li>تطوير خطة اتصال أزمات لمشروع ناشئ — من الذي يتحدث؟ ماذا تقول؟ لمن؟ ومتى؟</li>
    <li>تحليل الفرق بين الامتثال القانوني والمسؤولية الأخلاقية في إدارة الأزمات.</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    زبون توفي بعد استخدام منتجك. أنت لست مخطئاً — محقق جنائي هو المسؤول. لكن العلامة التجارية تحمل اسمك. القانون لا يلزمك بسحب المنتج. مستشاروك ينصحونك بعدم السحب لأنه سيشجع المقلدين وسيكلف ثروة. لكن ضميرك يقول: اسحبه.<br><br>
    <b>هل تتبع القانون أم ضميرك؟</b>
  </div>

  <h3>التطبيق المحلي: خطة اتصال الأزمات للمشاريع الحائلية</h3>
  <ul>
    <li><b>مشروع أغذية في حائل:</b> اشتكى زبون من تسمم غذائي بعد تناول وجبة من مطعمك. كيف تتصرف في الساعة الأولى؟</li>
    <li><b>سمعة العائلة في الأعمال الحائلية:</b> في بيئة الأعمال العائلية بحائل، الأزمة لا تضرب فقط العلامة التجارية — تضرب سمعة العائلة. كيف تصمم خطة أزمات تحمي كليهما؟</li>
    <li><b>منتج زراعي حائلي:</b> دفعة من منتجك الزراعي (تمور، عسل) تبين أنها ملوثة. ما خطتك لاستدعاء المنتج والتعامل مع العملاء الغاضبين؟</li>
    <li><b>دور هيئة الغذاء والدواء السعودية:</b> كيف تتعاون مع الهيئات التنظيمية السعودية أثناء الأزمة بدلاً من الاختباء منها؟</li>
  </ul>

  <h3>الواجب التحضيري</h3>
  <ul>
    <li>اكتب "عقيدتك" لمشروعك (أو مشروع افتراضي) — صفحة واحدة عن قيمك الأساسية ومسؤولياتك تجاه أصحاب المصلحة.</li>
    <li>فكر في أسوأ سيناريو ممكن لمشروعك ("ما قبل الوفاة"). ماذا ستفعل في الدقائق العشر الأولى؟</li>
    <li>ابحث عن أزمة علامة تجارية سعودية واحدة. كيف تعاملت معها؟ قارن مع استراتيجية J&J.</li>
  </ul>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: Johnson & Johnson Our Credo (1943)؛ Harvard Business School Case 9-583-043؛ New York Times Archives (1982)</span>
  </div>
</div>`,
  },

  // ==================== Patagonia — Sustainability ====================
  {
    filename: 'Patagonia_Sustainability_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>Patagonia: الأرض هي المساهم الوحيد — هل يمكن للرأسمالية أن تنقذ الكوكب؟</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>Patagonia, Inc.</td></tr>
    <tr><td class="label">الصناعة</td><td>الملابس والمعدات الرياضية الخارجية</td></tr>
    <tr><td class="label">التأسيس</td><td>1973 — إيفون شوينارد</td></tr>
    <tr><td class="label">المقر الرئيسي</td><td>فينتورا، كاليفورنيا، الولايات المتحدة</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>الإيرادات: 1.5 مليار دولار+ سنوياً؛ 100% من الأسهم الممتازة (بدون حق التصويت) محولة لمكافحة تغير المناخ (2022)</td></tr>
    <tr><td class="label">محور الدراسة</td><td>الاستدامة والمسؤولية الاجتماعية — بناء نموذج ربحية متماشٍ مع القيم البيئية</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>تحليل كيف يمكن لنموذج أعمال ربحي أن يدمج الاستدامة البيئية كاستراتيجية أساسية وليس نشاطاً جانبياً</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>في سبتمبر 2022، أعلن إيفون شوينارد — مؤسس Patagonia البالغ من العمر 83 عاماً والمتسلق الأسطوري — أن عائلته تخلت عن ملكية الشركة. ليس لأبناء العائلة. ليس لمستثمرين. ليس لطرح عام أولي. بل لكوكب الأرض. "الأرض الآن هي المساهم الوحيد لدينا،" كتب شوينارد في رسالته الشهيرة. تم تحويل 100% من الأسهم الممتازة للشركة (بقيمة 3 مليار دولار) إلى صندوقين ائتمانيين بيئيين: Holdfast Collective (الذي يملك 98% من الأسهم ويمول منظمات بيئية غير ربحية) و Patagonia Purpose Trust (الذي يملك 2% مع حقوق التصويت لضمان بقاء قيم الشركة). كل الأرباح المستقبلية — حوالي 100 مليون دولار سنوياً — ستذهب لـ "حماية الطبيعة والتنوع البيولوجي ومكافحة أزمة المناخ."</p>
  <p>لم تكن خطوة شوينارد مفاجئة لمن يتابع تاريخ Patagonia. منذ عام 1986، تبرعت الشركة بـ 1% من مبيعاتها (وليس أرباحها — المبيعات!) للقضايا البيئية من خلال برنامج "1% من أجل الكوكب" الذي شاركت في تأسيسه. في الجمعة السوداء 2011، نشرت Patagonia إعلاناً كاملاً في نيويورك تايمز بعنوان: "لا تشترِ هذه السترة" — تحث المستهلكين على التفكير مرتين قبل الشراء وإصلاح الملابس بدلاً من استبدالها. زادت المبيعات 30%.</p>
  <p>تتناول هذه الحالة السؤال الوجودي للرأسمالية الحديثة: هل يمكن للربح والقيم أن يتعايشا فعلاً؟ أم أن الاستدامة مجرد أداة تسويقية ذكية؟ Patagonia تثبت — بأرباحها ونموها وولاء عملائها — أن الاستدامة يمكن أن تكون استراتيجية تنافسية مربحة وليس تكلفة أخلاقية. لكن هل يمكن تكرار نموذجها؟</p>

  <h3>الخلفية</h3>
  <p>إيفون شوينارد متسلق جبال لم ينوِ أبداً أن يصبح رجل أعمال. بدأ بصنع مسامير التسلق في مرآب منزله عام 1957 لأنه لم يجد معدات تناسب احتياجاته. باعها من صندوق سيارته. تدريجياً، توسع إلى الملابس الرياضية المتينة. لكن شوينارد كان دائماً من دعاة البيئة أولاً ورجل أعمال ثانياً. عندما اكتشف أن مسامير التسلق التي يصنعها تدمر الصخور، أوقف إنتاجها — حتى لو كانت تمثل 70% من مبيعاته.</p>
  <p>هذه الفلسفة — "نحن في العمل لإنقاذ كوكبنا الأم" — كانت تناقضاً صارخاً مع نموذج الأعمال التقليدي. Patagonia أصبحت شركة B-Corp معتمدة. استثمرت في القطن العضوي والبوليستر المعاد تدويره والتجارة العادلة. أنشأت Worn Wear — برنامج إصلاح وإعادة بيع الملابس المستعملة. قاضت إدارة ترامب مرتين لحماية الأراضي العامة. كل هذه الإجراءات كانت ستعتبر "تدميراً للقيمة" في أي كلية إدارة أعمال تقليدية. لكنها بنت ولاء عملاء أسطورياً وعلامة تجارية لا يمكن للمنافسين تقليدها.</p>
</div>

<div class="page">
  <div class="page-header">دراسة حالة: Patagonia — الصفحة 2 من 2</div>

  <table class="data">
    <thead><tr><th>السنة</th><th>الإيرادات (تقديرية)</th><th>الحدث الرئيسي</th></tr></thead>
    <tbody>
      <tr><td>1973</td><td>—</td><td>تأسيس Patagonia</td></tr>
      <tr><td>1986</td><td>—</td><td>إطلاق برنامج 1% من أجل الكوكب</td></tr>
      <tr><td>2011</td><td>~500M</td><td>إعلان "لا تشترِ هذه السترة" — مبيعات +30%</td></tr>
      <tr><td>2012</td><td>~600M</td><td>شهادة B-Corp</td></tr>
      <tr><td>2018</td><td>~1B</td><td>تغيير بيان المهمة إلى: "نحن في العمل لإنقاذ كوكبنا الأم"</td></tr>
      <tr><td>2022</td><td>1.5B+</td><td>نقل ملكية 3 مليار دولار للصناديق البيئية</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. الاستدامة كاستراتيجية</h4>
  <ul>
    <li>هل استدامة Patagonia هي استراتيجية عمل ذكية أم تضحية أخلاقية حقيقية؟ هل يمكن أن تكون الاثنين معاً؟</li>
    <li>لماذا زادت مبيعات Patagonia بعد إعلان "لا تشترِ هذه السترة" — الذي يطلب من الناس حرفياً عدم الشراء؟ ما السيكولوجية وراء ذلك؟</li>
    <li>كيف تحول Patagonia الاستدامة من "تكلفة" إلى "ميزة تنافسية"؟</li>
  </ul>
  <h4>2. نموذج الملكية</h4>
  <ul>
    <li>قرار شوينارد بنقل الملكية لكوكب الأرض — جنون نبيل أم عبقرية استراتيجية؟ ماذا سيكون التأثير طويل المدى على الشركة؟</li>
    <li>هل يمكن تكرار نموذج ملكية Patagonia مع شركات أخرى؟ ما الشروط المسبقة لذلك؟</li>
    <li>لو كنت مستثمراً، هل كنت ستستثمر في شركة كل أرباحها تذهب للبيئة؟ لماذا أو لماذا لا؟</li>
  </ul>
  <h4>3. التوتر بين الربح والقيم</h4>
  <ul>
    <li>Patagonia حققت إيرادات 1.5 مليار+ ببيع منتجات استهلاكية. أليس هذا تناقضاً — بيع أشياء "لإنقاذ الكوكب" بينما يساهم الاستهلاك نفسه في التدهور البيئي؟</li>
    <li>كيف تتعامل مع اتهام "الغسيل الأخضر" (Greenwashing) — أن استدامتك مجرد تسويق؟</li>
    <li>أين ترسم الخط بين "مسؤولية اجتماعية حقيقية" و"تسويق ذكي للعلامة التجارية"؟</li>
  </ul>
  <h4>4. التطبيق في السعودية ورؤية 2030</h4>
  <ul>
    <li>كيف تتماشى مبادئ Patagonia مع رؤية 2030 — خاصة الاستدامة البيئية ومبادرة السعودية الخضراء؟</li>
    <li>هل يمكن لشركة سعودية في قطاع الزراعة أو السياحة أو الطاقة أن تتبنى نموذج "الاستدامة كاستراتيجية" مماثلاً؟</li>
    <li>ما التحديات الفريدة لتطبيق نموذج Patagonia في الاقتصاد السعودي — ثقافياً وقانونياً وسوقياً؟</li>
  </ul>

  <h3>الأطر الرئيسية</h3>
  <ul>
    <li><b>المحصلة الثلاثية (Triple Bottom Line):</b> الناس (People)، الكوكب (Planet)، الربح (Profit) — نموذج إدارة الأداء المستدام.</li>
    <li><b>نموذج الاقتصاد الدائري:</b> من "اصنع-استخدم-ارمِ" إلى "اصنع-استخدم-أعد التدوير-أعد الاستخدام."</li>
    <li><b>شهادة B-Corp:</b> معايير الأداء الاجتماعي والبيئي والشفافية والمساءلة القانونية.</li>
    <li><b>نظرية القيمة المشتركة (Porter & Kramer):</b> خلق قيمة اقتصادية بطريقة تخلق أيضاً قيمة للمجتمع من خلال معالجة احتياجاته وتحدياته.</li>
  </ul>

  <h3>الأهداف التعليمية</h3>
  <ul>
    <li>فهم كيف يمكن دمج الاستدامة البيئية في صميم استراتيجية الأعمال بدلاً من معاملتها كنشاط هامشي للمسؤولية الاجتماعية.</li>
    <li>تحليل نموذج ملكية Patagonia المبتكر — وهل يمكن تكراره في سياقات مختلفة.</li>
    <li>تقييم الجدوى الاقتصادية لنماذج الأعمال المستدامة في السوق السعودي.</li>
    <li>تطوير أفكار لمشاريع مستدامة في حائل تتماشى مع رؤية 2030.</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    أنت مؤسس شركة ناشئة ناجحة. شركتك تحقق أرباحاً جيدة. لكنك تعلم أن نموذج عملك الحالي — رغم ربحيته — ليس مستداماً بيئياً. التحول إلى نموذج مستدام سيكلف كثيراً وقد يخفض أرباحك بشكل كبير. مستثمروك يريدون أرباحاً — وليس "إنقاذ الكوكب."<br><br>
    <b>هل تضحي بأرباحك من أجل الاستدامة؟ وإذا كان الجواب نعم، كيف تقنع مستثمريك؟</b>
  </div>

  <h3>التطبيق المحلي: الاستدامة والمسؤولية في حائل</h3>
  <ul>
    <li><b>الزراعة المستدامة في حائل:</b> حائل منطقة زراعية كبرى. كيف يمكن لمزرعة تمور أو حبوب حائلية أن تتبنى نموذج "الاستدامة كاستراتيجية" — الزراعة العضوية، الطاقة الشمسية، ترشيد المياه، التجارة العادلة مع المزارعين؟</li>
    <li><b>السياحة البيئية:</b> جبل أجا وصحراء النفود — كنوز طبيعية. كيف تبني مشروع سياحة بيئية مستدام يحمي الطبيعة بدلاً من استنزافها؟</li>
    <li><b>مبادرة السعودية الخضراء:</b> كيف يستفيد رواد الأعمال في حائل من برامج الاستدامة الحكومية لبناء مشاريع مربحة ومستدامة بيئياً؟</li>
    <li><b>الطاقة الشمسية في حائل:</b> مع شمس حائل الوفيرة، ما فرص بناء مشاريع طاقة شمسية مستدامة على نمط "ربح + قيمة بيئية"؟</li>
  </ul>

  <h3>الواجب التحضيري</h3>
  <ul>
    <li>اقرأ رسالة إيفون شوينارد "الأرض الآن هي المساهم الوحيد لدينا" (2022).</li>
    <li>احسب "البصمة الكربونية" لمشروعك (أو لمشروع افتراضي في حائل). ما أكبر ثلاثة مصادر للانبعاثات؟</li>
    <li>فكر في "إعلان Patagonia خاص بك" — لو كنت تبيع شيئاً وتطلب من الناس عدم شرائه، ماذا سيكون المنتج وماذا سيكون السبب؟</li>
  </ul>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: Patagonia.com؛ رسالة شوينارد (2022)؛ Harvard Business Review؛ B Lab</span>
  </div>
</div>`,
  },

  // ==================== Quibi — Feasibility ====================
  {
    filename: 'Quibi_Feasibility_Arabic_Case_Study.pdf',
    html: `
<div class="page">
  <h1>دراسة حالة MBA</h1>
  <h2>Quibi: فشل بقيمة 1.75 مليار دولار — لماذا يموت مشروع "فكرة عظيمة وفريق نجوم"؟</h2>

  <table class="meta">
    <tr><td class="label">الشركة</td><td>Quibi (Quick Bites)</td></tr>
    <tr><td class="label">الصناعة</td><td>الترفيه / البث الرقمي القصير</td></tr>
    <tr><td class="label">التأسيس</td><td>2018 (أغسطس) — جيفري كاتزنبرغ وميغ ويتمان</td></tr>
    <tr><td class="label">المقر الرئيسي</td><td>لوس أنجلوس، كاليفورنيا، الولايات المتحدة</td></tr>
    <tr><td class="label">الأرقام الرئيسية</td><td>تمويل 1.75 مليار دولار؛ مؤسسان أسطوريان؛ أُطلقت أبريل 2020؛ أُغلقت ديسمبر 2020 — 6 أشهر فقط</td></tr>
    <tr><td class="label">محور الدراسة</td><td>دراسة الجدوى — لماذا تفشل مشاريع ضخمة التمويل بفرق عمل من النجوم؟</td></tr>
    <tr><td class="label">الهدف التعليمي</td><td>تحليل أهمية التحقق من حاجة السوق الفعلية قبل بناء المنتج، بغض النظر عن حجم التمويل أو شهرة الفريق</td></tr>
  </table>

  <h3>ملخص تنفيذي</h3>
  <p>جيفري كاتزنبرغ — الرئيس التنفيذي الأسطوري السابق لـ Disney ورئيس DreamWorks Animation. ميغ ويتمان — الرئيسة التنفيذية السابقة لـ eBay و Hewlett Packard. معاً، جمعا 1.75 مليار دولار من أكبر الأسماء في هوليوود ووول ستريت: Disney، WarnerMedia، NBCUniversal، Sony،阿里巴巴 (Alibaba)، Goldman Sachs، JPMorgan. الفكرة؟ Quibi: منصة فيديو قصير (Quick Bites) — حلقات 7-10 دقائق، مصممة للمشاهدة على الهاتف أثناء التنقل. "هوليوود في جيبك." محتوى من الدرجة الأولى — ستيفن سبيلبرغ، جينيفر لوبيز، ليبرون جيمس، كريسي تيغن. أنفقوا 100,000 دولار في الدقيقة الواحدة من المحتوى — أغلى إنتاج في تاريخ التلفزيون.</p>
  <p>بعد ستة أشهر من الإطلاق، استسلمت Quibi. أغلقت المنصة. أعادت 350 مليون دولار المتبقية للمستثمرين. اختفت نهائياً. لماذا؟ ليس لأن التكنولوجيا لم تعمل. ليس لأن الفريق كان غير كفء. ليس لأن المنافسين دمروها. ماتت Quibi لأن أحداً لم يسأل السؤال الأبسط والأعمق: "هل يريد الناس فعلاً هذا المنتج؟"</p>
  <p>في عالم ما بعد TikTok و YouTube Shorts و Instagram Reels — حيث المحتوى القصير مجاني ووفير — كانت فكرة أن يدفع الناس 5 دولارات شهرياً لمشاهدة "محتوى قصير احترافي" افتراضاً لم يختبره أحد في السوق الحقيقي. جمعوا 1.75 مليار دولار قبل أن يثبتوا أن أي شخص يريد المنتج. هذه هي المأساة الكلاسيكية لـ "الانحياز للبناء" — بناء المنتج المثالي قبل التأكد من أن أحداً يحتاجه.</p>

  <h3>الخلفية</h3>
  <p>لاحظ كاتزنبرغ أن الناس يقضون ساعات على هواتفهم يشاهدون محتوى قصيراً — لكن المحتوى كان "هاوياً" (TikTok, YouTube). فكرته: ماذا لو أنتجت هوليوود محتوى قصيراً بجودة سينمائية؟ وأسماه "اللقمة السريعة" (Quick Bite = Quibi). كانت الفرضية: الناس يريدون جودة هوليوود بحجم "وجبة خفيفة" على هواتفهم أثناء تنقلاتهم — 10 دقائق في القطار، 7 دقائق في انتظار القهوة.</p>
  <p>جمع الفريق 1.75 مليار دولار بسرعة قياسية على جولتين قبل إطلاق المنتج. المستثمرون راهنوا على "الخيول وليس السباق" — مؤسسان من الطراز العالمي + علامات هوليوود الكبرى = نجاح مضمون. لكنهم نسوا السؤال الأساسي: هل يحتاج السوق هذا المنتج؟ الإطلاق في أبريل 2020 صادف أسوأ توقيت ممكن: جائحة كورونا. فجأة، لم يعد أحد "يتنقل" — الجميع في المنزل يشاهدون Netflix على شاشات التلفزيون الكبيرة. لكن كاتزنبرغ أصر لاحقاً أن الجائحة لم تكن السبب — المشكلة كانت أعمق.</p>
  <p>المشكلة الهيكلية: المحتوى القصير المجاني (TikTok, Reels, Shorts) كان "جيداً بما فيه الكفاية" لمعظم الناس. Quibi لم تقدم سبباً مقنعاً كافياً للدفع. إنتاج Hollywood-grade لا يهم إذا كان TikTok يقدم ما يكفي من الترفيه مجاناً. هذه هي "لعنة الجودة الزائدة" — بناء منتج أفضل مما يحتاجه السوق فعلياً.</p>
</div>

<div class="page">
  <div class="page-header">دراسة حالة: Quibi — الصفحة 2 من 2</div>

  <table class="data">
    <thead><tr><th>المرحلة</th><th>التاريخ</th><th>الحدث</th></tr></thead>
    <tbody>
      <tr><td>جمع التمويل</td><td>2018–2020</td><td>جمع 1.75 مليار دولار من Disney, Warner, Goldman Sachs وغيرهم</td></tr>
      <tr><td>الإطلاق</td><td>أبريل 2020</td><td>إطلاق المنصة بـ 50+ عرضاً — 4.99$ شهرياً مع إعلانات</td></tr>
      <tr><td>الصدمة</td><td>مايو 2020</td><td>910,000 تحميل فقط في الأسبوع الأول — التوقعات كانت بالملايين</td></tr>
      <tr><td>الانهيار</td><td>أكتوبر 2020</td><td>إعلان الإغلاق — بعد 6 أشهر فقط</td></tr>
      <tr><td>التصفية</td><td>ديسمبر 2020</td><td> إيقاف المنصة؛ إعادة 350 مليون دولار للمستثمرين</td></tr>
    </tbody>
  </table>

  <h3>أسئلة النقاش</h3>
  <h4>1. خطأ عدم التحقق من السوق</h4>
  <ul>
    <li>جمعت Quibi 1.75 مليار دولار قبل إطلاق المنتج. هل كان يجب على المستثمرين طلب إثبات على الطلب السوقي قبل الاستثمار؟</li>
    <li>ما الذي كان يمكن أن يفعله كاتزنبرغ وويتمان للتحقق من الحاجة السوقية قبل بناء Quibi بالكامل؟</li>
    <li>كيف يمكن لشركة ناشئة (بميزانية محدودة) أن تختبر الطلب السوقي قبل بناء المنتج؟ أعطِ ثلاث طرق محددة.</li>
  </ul>
  <h4>2. فخ "الخيول وليس السباق"</h4>
  <ul>
    <li>المستثمرون راهنوا على الفريق وليس على الفكرة. متى يكون هذا الرهان صحيحاً، ومتى يكون خطيراً؟</li>
    <li>كاتزنبرغ + ويتمان + سبيلبرغ — هل هناك أي فريق كان سيبدو "أكثر قابلية للاستثمار" من هذا؟ كيف تحمي نفسك من "انحياز الهالة" كرائد أعمال؟</li>
    <li>في بيئة ريادة الأعمال السعودية، ما مدى أهمية "الفريق المؤسس" مقابل "التحقق من السوق" عند تقييم فرصة استثمارية؟</li>
  </ul>
  <h4>3. التوقيت والسوق</h4>
  <ul>
    <li>هل كانت الجائحة السبب الحقيقي لفشل Quibi أم أنها مجرد كبش فداء؟</li>
    <li>لو أطلقت Quibi في 2015 (قبل TikTok) أو 2023 (بعد استقرار البث القصير)، هل كانت لتنجح؟</li>
    <li>كيف تحدد "التوقيت المناسب" لإطلاق منتج؟ ما المؤشرات التي تبحث عنها؟</li>
  </ul>
  <h4>4. الجودة الزائدة كخطأ استراتيجي</h4>
  <ul>
    <li>Quibi أنتجت محتوى بـ 100,000 دولار في الدقيقة. هل كان هذا "جودة زائدة" بالنسبة لحاجة السوق الفعلية؟</li>
    <li>مفهوم Minimum Viable Product (MVP): ما هو "المنتج الأدنى القابل للتطبيق" الذي كان يجب أن تطلقه Quibi أولاً بدلاً من المنصة الكاملة بـ 50+ عرضاً؟</li>
    <li>كيف تقرر متى يكون "جيد بما فيه الكفاية" كافياً فعلاً، ومتى تحتاج إلى "جودة استثنائية"؟</li>
  </ul>

  <h3>الأطر الرئيسية</h3>
  <ul>
    <li><b>منهجية Lean Startup (إريك ريس):</b> بناء — قياس — تعلم. كيف كان يمكن لـ Quibi تطبيق هذه الدورة بدلاً من البناء الكامل أولاً.</li>
    <li><b>نموذج TAM SAM SOM:</b> تحليل السوق الكلي والمتاح والقابل للخدمة — هل كان سوق "الفيديو القصير المدفوع" كبيراً بما يكفي أصلاً؟</li>
    <li><b>إطار Jobs-to-Be-Done:</b> ما "المهمة" التي كان المستخدم "يستأجر" Quibi لأدائها؟ وهل كانت هناك بدائل مجانية تؤدي نفس المهمة؟</li>
    <li><b>نموذج وحدة الاقتصاد (Unit Economics):</b> تكلفة اكتساب العميل مقابل القيمة الدائمة للعميل — هل كانت معادلة Quibi مجدية حتى لو نجح التبني؟</li>
  </ul>

  <h3>الأهداف التعليمية</h3>
  <ul>
    <li>فهم لماذا حتى أفضل الفرق وأكبر التمويلات لا تضمن النجاح إذا لم يتم التحقق من الحاجة السوقية.</li>
    <li>تطوير مهارة تمييز "الفرضية" عن "الحقيقة" — وكيفية تحويل الفرضيات إلى حقائق عبر الاختبار.</li>
    <li>تعلم منهجية "المنتج الأدنى القابل للتطبيق" (MVP) لتجنب بناء منتجات لا يحتاجها السوق.</li>
    <li>تطبيق دروس Quibi في التحقق من السوق على فرص ريادة الأعمال في حائل.</li>
  </ul>

  <div class="dilemma-box">
    <span class="label">المعضلة المركزية</span>
    لديك فكرة رائعة. مستثمرون مستعدون لضخ الملايين. فريق أحلامك. كل المؤشرات تقول: "ابنِها الآن." لكن في داخلك صوت صغير يسأل: "هل أحد يحتاج هذا فعلاً؟" إجراء دراسة جدوى حقيقية سيؤخرك 6 أشهر. ربما يفوتك "نافذة السوق." ربما يسبقك منافس.<br><br>
    <b>هل تبني الآن أم تتحقق من السوق أولاً؟</b>
  </div>

  <h3>التطبيق المحلي: دراسات الجدوى في حائل</h3>
  <ul>
    <li><b>فكرة مشروع في حائل:</b> تخيل أن لديك فكرة مشروع — مثلاً "منصة حجز جولات جبل أجا." قبل أن تبني المنصة، كيف تختبر الطلب الحقيقي بأقل تكلفة ممكنة؟</li>
    <li><b>اختبار السوق بأسلوب "حائلي":</b> في سوق صغير نسبياً مثل حائل، يمكنك اختبار الفكرة بـ 10 عملاء محتملين فقط. كيف تصمم هذا الاختبار؟</li>
    <li><b>التمويل الحكومي والجدوى:</b> مع وجود برامج تمويل مثل "منشآت" وبنك التنمية الاجتماعية، هل تشجع هذه البرامج رواد الأعمال على "التحقق من السوق" قبل طلب التمويل، أم تخلق حافزاً لطلب التمويل بناءً على "فكرة" فقط؟</li>
    <li><b>رؤية 2030 وريادة الأعمال:</b> كيف توازن بين الطموحات الكبيرة لرؤية 2030 وحاجة السوق الفعلية على الأرض في حائل؟</li>
  </ul>

  <h3>الواجب التحضيري</h3>
  <ul>
    <li>اختر فكرة مشروع واحد. صمم "منتجاً أدنى قابل للتطبيق" (MVP) يمكن بناؤه بأقل من 1,000 ريال في أقل من أسبوع.</li>
    <li>أجرِ 5 مقابلات مع عملاء محتملين في حائل. اسألهم: "هل ستدفع مقابل هذا؟" وإذا قالوا نعم، اسأل: "كم؟" وإذا قالوا لا، اسأل: "لماذا؟"</li>
    <li>فكر في مشروع فاشل سمعت عنه. هل كان السبب أن "المنتج لم يكن جيداً" أم أن "السوق لم يكن يريد المنتج"؟</li>
  </ul>

  <div class="page-footer">
    <span>www.marfa.sa</span>
    <span>منصة مرفأ — دراسات حالة MBA | المصادر: Wall Street Journal؛ The Verge؛ Variety؛ Crunchbase؛ CNBC</span>
  </div>
</div>`,
  },
];

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const study of CASE_STUDIES) {
    console.log(`Generating: ${study.filename}...`);
    const page = await browser.newPage();
    const html = buildHTML(study);

    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);

    const outputPath = path.join(PUBLIC_DIR, study.filename);
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      preferCSSPageSize: false,
    });

    console.log(`  ✅ ${study.filename}`);
    await page.close();
  }

  await browser.close();
  console.log('\nAll 7 new Arabic case study PDFs generated successfully.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
