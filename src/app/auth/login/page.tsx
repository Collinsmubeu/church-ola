import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Church } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In | Church Ola",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Church className="h-5 w-5" />
          <span className="font-heading text-lg font-semibold">Church Ola</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center space-y-1 pb-6">
            <CardTitle className="font-heading text-3xl font-bold">
              Welcome back
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to your Church Ola member account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="justify-center pt-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      <footer className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Protected by Church Ola Security
        </p>
      </footer>
    </div>
  );
}