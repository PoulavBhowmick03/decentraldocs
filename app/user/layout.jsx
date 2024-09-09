"use client"
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "./components/UserSidebar";
import '../globals.css';
import { useAuth } from '@/hooks/useAuth'; // Import the custom hook

export default function UserLayout({ children }) {
  const authenticated = useAuth(); // Check if user is authenticated

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen bg-background">
        {authenticated ? <Sidebar /> : null} {/* Conditionally render sidebar */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </ThemeProvider>
  );
}
