import Link from 'next/link';

export default function MarfaMeetingsSection() {
    return (
        <section className="bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl p-8 shadow-xl relative overflow-hidden" id="meetings">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        مباشر
                    </div>

                    <h2 className="text-3xl font-bold text-slate-800">
                        جدول اللقاءات الاستثمارية
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        تتيح منصة "لقاءات مرفأ" فرصاً حصرية لرواد الأعمال لعرض مشاريعهم أمام نخبة من المستثمرين. اطلع على المواعيد المتاحة وكن جزءاً من الحدث.
                    </p>

                    <ul className="space-y-3">
                        {[
                            'جلسات تعارف وعرض أفكار (Pitching)',
                            'ورش عمل خاصة مع مستثمرين ملائكيين',
                            'لقاءات فردية (1:1) للمشاريع الواعدة'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-700">
                                <div className="h-6 w-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="pt-4">
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-4">
                            <div className="text-3xl">🔒</div>
                            <div>
                                <h3 className="font-bold text-slate-800 mb-1">المحتوى حصري للأعضاء</h3>
                                <p className="text-sm text-slate-500">
                                    يجب عليك <span className="text-blue-600 font-bold">تسجيل الدخول</span> لرؤية التواريخ والتسجيل في اللقاءات القادمة.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Visual/Image Placeholder */}
                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg group">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse group-hover:animate-none transition-all duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        <div className="text-center p-6">
                            <h3 className="text-xl font-bold text-slate-400 mb-2">منطقة الأعضاء</h3>
                            <p className="text-slate-400 text-sm">سجل دخولك للوصول</p>
                        </div>
                    </div>
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                </div>
            </div>
        </section>
    );
}
