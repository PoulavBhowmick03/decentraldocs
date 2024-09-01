// import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from "@/components/theme-provider";
import '../globals.css'

export default function UserLayout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="Dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen bg-background">
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </ThemeProvider>
  );
}
