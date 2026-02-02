"use client";

import AcademySchedule from '../../components/marfa/AcademySchedule';
import LiveCaseStudy from '../../components/marfa/LiveCaseStudy';

export default function AcademyPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                <div className="text-center space-y-4 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-black text-gradient">
                        أكاديمية مرفأ
                    </h1>
                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
                        حيث يلتقي التعليم بالتجربة الواقعية لبناء قادة المستقبل
                    </p>
                </div>

                {/* Live Session Section */}
                <div className="animate-fade-in-up delay-100">
                    <LiveCaseStudy />
                </div>

                <div className="animate-fade-in-up delay-200">
                    <AcademySchedule />
                </div>
            </div>
        </main>
    );
}
