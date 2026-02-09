import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "برنامج رعاية ماراثون حائل 2026 | جمعية نشاط الرياضية",
    description: "فرصة استثمارية فريدة للوصول إلى 800+ مشارك نشط و 3000 زائر. برنامج رعاية متدرج يناسب جميع الشركات.",
    robots: "noindex, nofollow", // Prevent search engine indexing for privacy
};

export default function HailMarathonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
