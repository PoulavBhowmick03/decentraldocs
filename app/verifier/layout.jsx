import { Inter } from "next/font/google";
import "../globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useEffect } from "react";
import useWallet from "@/hooks/useWallet";
import getAccountType from "@/actions/getAccountType";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DecentralDocs Verifier Portal",
  description: "Secure document verification for authorized personnel",
};

export default function VerifierLayout({ children }) {
  const { account } = useWallet();

  useEffect(() => {
    if (account) {
      getAccountType(account).then((type) => {
        if (type !== 2) {
          window.location.href = "/404";
        }
      });
    }
  }, [account]);
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
              <div className="container mx-auto px-6 py-8">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
