"use client";

import { issueDocument } from "@/actions/issue";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    console.log("start");

    async function call() {
      const res = await issueDocument({
        title: "Test Document",
        content: "This is a test document",
        issuedAt: Date.now(),
        blockchainHash: "0xffffffffff",
        ownerId: "0xaaaaaaaaaaaaa",
        issuerId: "0xfffffffff",
        type: "BIRTH_CERTIFICATE",
      });

      console.log(res);
    }

    call();
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
