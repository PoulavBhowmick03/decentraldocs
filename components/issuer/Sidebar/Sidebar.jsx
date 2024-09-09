import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaSearch,
  FaWallet,
  FaSignOutAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import Image from "next/image";

import logo from "@/public/logo.svg";
import ConnectWallet from "@/components/ConnectWallet";
import useWallet from "@/hooks/useWallet";

export default function Sidebar({ show, setter }) {
  const router = useRouter();
  const { account, connect, disconnect, switchWallet } = useWallet();

  const className =
    "bg-gray-800 w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40";
  const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";

  const MenuItem = ({ icon, name, route }) => {
    const colorClass =
      router.pathname === route
        ? "bg-gray-700 text-white"
        : "text-gray-400 hover:bg-gray-700 hover:text-white ";

    return (
      <Link
        href={route}
        onClick={() => {
          setter((oldVal) => !oldVal);
        }}
        className={`flex gap-1 [&>*]:my-auto text-md pl-6 py-3 border-b-[1px] border-b-white/10 ${colorClass}`}
      >
        <div className="text-xl flex [&>*]:mx-auto w-[30px]">{icon}</div>
        <div>{name}</div>
      </Link>
    );
  };

  const ModalOverlay = () => (
    <div
      className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
      onClick={() => {
        setter((oldVal) => !oldVal);
      }}
    />
  );

  return (
    <>
      <div className={`${className}${appendClass}`}>
        <div className="p-2 flex">
          <Link href="/">
            <Image src={logo.src} alt="Company Logo" width={300} height={300} />
          </Link>
        </div>
        <div className="flex flex-col">
          <MenuItem name="Home" route="/issuer" icon={<FaHome />} />
          <MenuItem name="Search" route="/issuer/search" icon={<FaSearch />} />
          <MenuItem
            name="Issue"
            route="/issuer/issue"
            icon={<FaCheckCircle />}
          />
          <MenuItem
            name="Account"
            route="/issuer/account"
            icon={<MdAccountCircle />}
          />
          <MenuItem name="Wallet" route="/issuer/wallet" icon={<FaWallet />} />
          <MenuItem
            name="Sign Out"
            route="/issuer/signout"
            icon={<FaSignOutAlt />}
          />
          <MenuItem
            name="Settings"
            route="/issuer/settings"
            icon={<IoSettings />}
          />
        </div>
        <ConnectWallet
          account={account}
          connect={connect}
          disconnect={disconnect}
          switchWallet={switchWallet}
        />
      </div>
      {show ? <ModalOverlay /> : <></>}
    </>
  );
}
