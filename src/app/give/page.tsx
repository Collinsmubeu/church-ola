import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  CreditCard,
  Banknote,
  Apple,
  Shield,
  CheckCircle,
} from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";

export const metadata: Metadata = {
  title: "Give | Church Ola",
};

export default function GivePage() {
  return (
    <PublicLayout>
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="size-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="size-10 text-primary" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Give Online</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Your generosity helps Church Ola serve our community. All giving is secure and tax-deductible.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: CreditCard, title: "One-Time Gift", desc: "Give a single donation now." },
              { icon: Banknote, title: "Recurring", desc: "Set up monthly or weekly giving." },
              { icon: Shield, title: "Secure", desc: "Encrypted and protected." },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6 text-center">
                  <item.icon className="size-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-heading text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="size-5 text-primary" /> Donation Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-6">
                  Online giving is currently available through our secure payment partner.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" className="gap-2">
                    <CreditCard className="size-5" /> Give with Card
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Banknote className="size-5" /> Bank Transfer
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Apple className="size-5" /> Apple Pay
                  </Button>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="size-4 text-green-500" /> PCI Compliant
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="size-4 text-green-500" /> Tax Receipts
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="size-4 text-green-500" /> Cancel Anytime
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Badge variant="secondary" className="text-sm">
              Questions? Contact giving@churchola.org
            </Badge>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}