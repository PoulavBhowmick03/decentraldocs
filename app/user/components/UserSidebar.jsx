import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  Wallet,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ConnectWallet from "@/components/ConnectWallet";
import useWallet from "@/hooks/useWallet";

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/user" },
  { icon: FileText, label: "My Documents", href: "/user/documents" },
  { icon: Wallet, label: "Connect Wallet", href: "/user/wallet" },
  { icon: Bell, label: "Notifications", href: "/user/notifications" },
  { icon: User, label: "My Profile", href: "/user/profile" },
  { icon: Settings, label: "Settings", href: "/user/settings" },
];

const sidebarVariants = {
  open: { 
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  closed: { 
    x: "-100%",
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

const itemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -20 }
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { account, connect, disconnect, switchWallet } = useWallet();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setAuthenticated(false);
      router.push("/user/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      <AnimatePresence>
        {(isOpen || typeof window !== "undefined" && window.innerWidth >= 1024) && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 shadow-lg overflow-y-auto lg:relative"
          >
            <div className="p-4 space-y-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-blue-600"
              >
                DecentralDocs
              </motion.div>

              <nav className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.href}>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className="w-full justify-start text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                variants={itemVariants}
                transition={{ delay: sidebarItems.length * 0.1 }}
              >
                <ConnectWallet
                  account={account}
                  connect={connect}
                  disconnect={disconnect}
                  switchWallet={switchWallet}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                transition={{ delay: (sidebarItems.length + 1) * 0.1 }}
                className="absolute bottom-4 w-52"
              >
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}