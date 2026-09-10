import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Church Ola",
  description: "Sign in to your Church Ola member account.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted/40 to-background p-4">
      {children}
    </div>
  );
}