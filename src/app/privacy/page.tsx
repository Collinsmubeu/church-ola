import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Lock, Eye, UserCheck, Database, Mail } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Church Ola",
};

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="size-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="size-10 text-primary" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Your privacy and trust are important to us. This policy explains how we collect,
            use, and protect your information.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="size-5 text-primary" /> What We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We collect information necessary to serve you as a member of Church Ola,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Attendance and giving records</li>
                <li>Ministry or volunteer team assignments</li>
                <li>Account credentials and authentication data</li>
              </ul>
              <p>
                We practice data minimization: only what is genuinely needed is collected,
                and data is anonymized or removed when no longer required.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="size-5 text-primary" /> How We Protect Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>In transit:</strong> All data is encrypted via SSL/HTTPS.
                </li>
                <li>
                  <strong>At rest:</strong> Sensitive information is stored in encrypted
                  databases.
                </li>
                <li>
                  <strong>Role-based access:</strong> Staff only see the minimum data
                  required for their role.
                </li>
                <li>
                  <strong>Multi-factor authentication:</strong> Required for all staff
                  logins.
                </li>
                <li>
                  <strong>Secure giving:</strong> Donations are processed through
                  PCI-compliant providers; we never store card data in-house.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="size-5 text-primary" /> Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction or deletion of your data</li>
                <li>Withdraw consent for marketing communications</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>
              <p>
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:privacy@churchola.org" className="text-primary hover:underline">
                  privacy@churchola.org
                </a>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="size-5 text-primary" /> Sharing &amp; Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We do not sell your data. We share information only with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service providers (hosting, email, giving processors) under strict data-processing agreements</li>
                <li>Legal obligations when required by law</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="size-5 text-primary" /> Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Questions about this policy? Contact our privacy team at{" "}
                <a href="mailto:privacy@churchola.org" className="text-primary hover:underline">
                  privacy@churchola.org
                </a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}