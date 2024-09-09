"use client";

import Layout from "@/components/issuer/Sidebar";
import useWallet from "@/hooks/useWallet";
import getAccountType from "@/actions/getAccountType";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  const { account } = useWallet();

  useEffect(() => {
    if (account) {
      getAccountType(account).then((type) => {
        if (type !== 1) {
          window.location.href = "/404";
        }
      });
    }
  }, [account]);

  return <Layout>{children}</Layout>;
}
