"use client";
import { Inter } from "next/font/google";
import "../globals.css";
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
// Constellation Background Component
const ConstellationBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const stars = [];
    const numStars = 200; // Number of stars

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1, // Thinner stars
        speedX: Math.random() * 0.2 - 0.1,
        speedY: Math.random() * 0.2 - 0.1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`, // Clearer stars
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0 || star.x > canvas.width) star.speedX *= -1;
        if (star.y < 0 || star.y > canvas.height) star.speedY *= -1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.width = 0;
      canvas.height = 0;
    };
  }, []);

  return <canvas ref={canvasRef} className="constellation-background"></canvas>;
};


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

