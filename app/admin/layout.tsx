// Pass-through layout — protected pages use (protected)/layout.tsx instead
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
