import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Church Ola",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {children}
    </div>
  );
}