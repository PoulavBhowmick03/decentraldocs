"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  Wallet,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/user" },
  { icon: FileText, label: "My Documents", href: "/user/documents" },
  { icon: Wallet, label: "Connect Wallet", href: "/user/wallet" },
  { icon: Bell, label: "Notifications", href: "/user/notifications" },
  { icon: User, label: "My Profile", href: "/user/profile" },
  { icon: Settings, label: "Settings", href: "/user/settings" },
];

export default function UserSidebar() {
  const [authenticated, setAuthenticated] = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      // Redirect to the login page or home page after logout
      setAuthenticated(false);
      console.log(authenticated);
      router.push("/user/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-64 bg-card text-card-foreground p-4 space-y-4 border-r">
      <div className="text-2xl font-bold mb-6">DecentralDocs</div>
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-4 w-52">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut
            onClick={handleLogout}
            className="mr-2 h-4 w-4"
          />
          Logout
        </Button>
      </div>
    </div>
  );
}
