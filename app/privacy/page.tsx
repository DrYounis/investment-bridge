import React from 'react';
import Card from '../components/ui/Card';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-800 mb-4">سياسة الخصوصية وشروط الاستخدام</h1>
                    <p className="text-gray-600">منصة "مرفأ"</p>
                </div>

                <Card className="p-8 md:p-12 bg-white shadow-sm">
                    <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed text-right">

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. مقدمة</h2>
                            <p>
                                تلتزم منصة "الوسيط الاستثماري" (مرفأ) بحماية خصوصية بيانات مستخدميها (مبتكرين ومستثمرين) وفقاً للأنظمة واللوائح المعمول بها في المملكة العربية السعودية، وعلى رأسها نظام حماية البيانات الشخصية (PDPL). تهدف هذه السياسة إلى توضيح كيفية جمع، استخدام، وحماية البيانات والأفكار المرفوعة على المنصة.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. جمع البيانات ومعالجتها</h2>
                            <p className="mb-2">تقوم المنصة بجمع البيانات التالية لغرض الربط الاستثماري:</p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li><strong>بيانات الهوية:</strong> الاسم، ورقم الهوية/السجل التجاري (للمستثمرين)، ومعلومات التواصل.</li>
                                <li><strong>بيانات المشروع:</strong> الإجابات المقدمة عبر نماذج الأسئلة المتشعبة، وصف الفكرة، والقطاع المستهدف.</li>
                                <li><strong>بيانات الاستخدام:</strong> ملفات تعريف الارتباط (Cookies) لتحسين تجربة المستخدم داخل المنصة.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. حماية الملكية الفكرية وسرية الأفكار</h2>
                            <ul className="list-disc pr-6 space-y-2">
                                <li><strong>البيئة الخاصة:</strong> تقر المنصة بأن كافة الأفكار والمشاريع المرفوعة تُعد ملكية خاصة لأصحابها، ولا يتم عرضها للعموم.</li>
                                <li><strong>الوصول المقيد:</strong> لا يتم السماح بالاطلاع على تفاصيل المشاريع إلا للمستثمرين الذين تم اعتمادهم يدوياً من قبل إدارة المنصة بعد التحقق من هويتهم وجديتهم.</li>
                                <li><strong>اتفاقية عدم الإفصاح (NDA):</strong> بمجرد التسجيل في المنصة، يوافق المستثمر ضمنياً على عدم تسريب أو استخدام أي فكرة تم الاطلاع عليها خارج نطاق المنصة، ويتحمل المسؤولية القانونية الكاملة في حال مخالفة ذلك أمام الجهات القضائية المختصة في المملكة.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. نظام "الأسئلة المتشعبة" والبيانات المهيكلة</h2>
                            <p className="mb-2">يوافق صاحب الفكرة على أن البيانات التي يقدمها من خلال نظام الأسئلة يتم معالجتها آلياً بواسطة خوارزميات المنصة لغرض:</p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li>توليد "مؤشر الجذب الاستثماري".</li>
                                <li>تصنيف المشروع ضمن القطاعات (سياحة، صحة، تعليم، إلخ).</li>
                                <li>تحسين جودة الفكرة عبر "محرك النصائح" الذكي.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. مشاركة البيانات مع طرف ثالث</h2>
                            <ul className="list-disc pr-6 space-y-2">
                                <li>لا تقوم المنصة ببيع أو تأجير البيانات الشخصية لأي جهات تسويقية خارجية.</li>
                                <li>يتم مشاركة ملخص الفكرة (الـ 20 كلمة) مع المستثمرين المعتمدين فقط، ولا يتم كشف تفاصيل الهوية الكاملة لصاحب الفكرة إلا بعد إبداء رغبة متبادلة في التواصل.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. حقوق المستخدم</h2>
                            <p className="mb-2">وفقاً للأنظمة السعودية، يحق للمستخدم:</p>
                            <ul className="list-disc pr-6 space-y-2">
                                <li>الوصول إلى بياناته وتصحيحها.</li>
                                <li>طلب إتلاف البيانات عند الرغبة في إغلاق الحساب (ما لم تكن هناك متطلبات قانونية للاحتفاظ بها).</li>
                                <li>سحب الموافقة على معالجة البيانات في أي وقت، مما قد يؤثر على القدرة على استخدام خدمات المنصة.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. التزامات المستثمر المعتمد</h2>
                            <p>
                                يقر المستثمر بأن حسابه شخصي ولا يجوز مشاركته مع أطراف أخرى. أي محاولة لنسخ بيانات المشاريع أو تصويرها تؤدي إلى إلغاء الاعتماد فوراً والملاحقة القانونية.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. القانون الواجب التطبيق</h2>
                            <p>
                                تخضع هذه السياسة وتُفسر وفقاً للأنظمة واللوائح المعمول بها في المملكة العربية السعودية، وتختص المحاكم السعودية بالفصل في أي نزاع ينشأ عنها.
                            </p>
                        </section>

                        <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-xl text-center">
                            <p className="text-sm text-blue-800">
                                آخر تحديث: {new Date().toLocaleDateString('ar-SA')} | فريق منصة مرفأ
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
