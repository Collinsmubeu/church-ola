import { Metadata } from "next";
import PublicLayout from "@/components/layouts/PublicLayout";

export const metadata: Metadata = {
  title: "Sign In | Church Ola",
  description: "Sign in to your Church Ola member account.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8">
        {children}
      </div>
    </PublicLayout>
  );
}