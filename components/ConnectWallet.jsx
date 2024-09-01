import React, { useState, useRef, useEffect } from "react";

const ConnectWallet = ({ account, connect, disconnect, switchWallet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="flex justify-center text-left pt-4">
      {account ? (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center space-x-2"
          >
            <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    switchWallet();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Switch Wallet
                </button>
                <button
                  onClick={() => {
                    disconnect();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={connect}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
