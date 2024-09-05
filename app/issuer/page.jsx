"use client";

import Head from "@/components/issuer/Head";
import { DocumentArray } from "@/components/issuer/DocumentArray";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function IssuerPage() {
  const [auth] = useAuth();
  const router = useRouter()

  // useEffect(() => {
  //   if (!auth) {
  //     router.push("/404");
  //   }
  // }, [auth, router]);
  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <div className="sm:pl-24 ">
        <Head />
        <DocumentArray />
      </div>
    </div>
  );
}
