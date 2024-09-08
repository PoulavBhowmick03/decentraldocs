"use client";

import { useState, useEffect } from "react";

const Head = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fakeUser = "Sagar Rana";
    setUser(fakeUser);
  }, []);

  return (
    <header>
      <div className="max-w-screen-xl py-8 sm:px-2 sm:py-12 lg:px-10">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-black sm:text-3xl">
              Welcome Back, {user}
            </h1>
            <p className="mt-1.5 text-sm text-black">
              You can see your DecentralDocs issued documents here!
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
            <button
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-5 py-3 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring"
              type="button"
            >
              <span className="text-sm font-medium">My Profile</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </button>

            <button
              className="block rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring"
              type="button"
            >
              Register as Issuer
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Head;
