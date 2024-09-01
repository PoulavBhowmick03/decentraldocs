// import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from "@/components/theme-provider";
import UserSidebar from "./components/UserSidebar";
import '../globals.css'

export default function UserLayout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen bg-background">
        <UserSidebar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </ThemeProvider>
  );
}
