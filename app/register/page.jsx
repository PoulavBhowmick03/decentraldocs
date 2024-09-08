"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
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
import { motion, AnimatePresence } from "framer-motion";
import { User, Building, CheckSquare } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function AccountTypePage() {
  const authenticated = useAuth();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);

  const handleSelection = (accountType) => {
    setSelectedType(accountType);
    setTimeout(() => {
      router.push(`/register/${accountType}`);
    }, 500); // Delay to allow animation to complete
  };

  const accountTypes = [
    {
      type: "issuer",
      icon: Building,
      description: "Issue and manage documents",
    },
    {
      type: "verifier",
      icon: CheckSquare,
      description: "Verify document authenticity",
    },
    { type: "user", icon: User, description: "Store and share your documents" },
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const cardVariants = {
    initial: { scale: 0.9, opacity: 0 },
    in: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    // Add a class to the body for global styles
    document.body.classList.add(inter.className);
    return () => {
      document.body.classList.remove(inter.className);
    };
  }, []);

  return (
    <div>
      <Navigation />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto mt-20 pt-24">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-8 text-center text-primary"
          >
            Choose Your Account Type
          </motion.h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {accountTypes.map(({ type, icon: Icon, description }, index) => (
                <motion.div
                  key={type}
                  variants={cardVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="w-full h-full flex flex-col justify-between bg-card hover:bg-card/90 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-center mb-4">
                        <Icon size={48} className="text-primary" />
                      </div>
                      <CardTitle className="capitalize text-2xl text-center">
                        {type}
                      </CardTitle>
                      <CardDescription className="text-center">
                        {description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleSelection(type)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={selectedType !== null}
                      >
                        {selectedType === type ? "Selected" : "Select"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </motion.div>
    </div>
  );
}
