import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "نظم الهندسة المبتكرة للتسويق | المسؤولية الاجتماعية للشركات CSR",
    description: "حيث تلتقي الدقة الهندسية بفن التسويق الخيري. متخصصون في الوساطة التسويقية للقطاع الثالث في حائل، السعودية بنموذج صفر مخاطرة.",
    keywords: ["تسويق خيري", "مسؤولية اجتماعية", "حائل", "جمعيات خيرية", "استدامة مالية", "القطاع الثالث"],
};

export default function CSRLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
