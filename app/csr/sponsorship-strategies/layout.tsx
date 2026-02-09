import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "استراتيجيات جلب الرعايات | نظم الهندسة المبتكرة للتسويق",
    description: "نبني استراتيجيات شاملة لجذب المانحين الاستراتيجيين للقطاع الثالث بناءً على دراسة عميقة للسوق المحلي في حائل. منهجية علمية متكاملة من البحث إلى التنفيذ.",
    keywords: ["رعايات", "مانحون استراتيجيون", "القطاع الثالث", "جمعيات خيرية", "حائل", "تمويل مؤسسي"],
};

export default function SponsorshipStrategiesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
