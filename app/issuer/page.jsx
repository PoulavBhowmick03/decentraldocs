import Head from "@/components/issuer/Head";
import { DocumentArray } from "@/components/issuer/DocumentArray";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sm:pl-24 ">
        <Head />
        <DocumentArray />
      </div>
    </div>
  );
}
