import { Head } from "@/components/issuer/search/Head";
import Bar from "@/components/issuer/search/Bar";
import Recents from "@/components/issuer/search/Recents";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <div className="sm:pl-24 ">
        <Head />
        <Bar />
        <Recents />
      </div>
    </div>
  );
}
