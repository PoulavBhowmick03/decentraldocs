"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const authenticated = useAuth();
  const router = useRouter();
  const handleSelection = (accountType) => {
    router.push(`/register/${accountType}`);
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="Dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <div className="container mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Choose Account Type
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["issuer", "verifier", "user"].map((type) => (
                <Card key={type} className="w-full">
                  <CardHeader>
                    <CardTitle className="capitalize">{type}</CardTitle>
                    <CardDescription>Register as a {type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleSelection(type)}
                      className="w-full"
                    >
                      Select
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
