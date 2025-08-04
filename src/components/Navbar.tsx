"use client";
import { client } from "@/app/client";
import Link from "next/link";
import {
  ConnectButton,
  darkTheme,
  lightTheme,
  useActiveAccount,
} from "thirdweb/react";
import Image from "next/image";
import thirdwebIcon from "@public/thirdweb.svg";

const Navbar = () => {
  const account = useActiveAccount();

  return (
    <nav className="bg-black border-b border-blue-500/50 shadow-lg shadow-blue-500/20">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo always on the left */}
          <div className="flex-shrink-0 flex items-center">
            <svg
              width="50"
              height="30"
              viewBox="0 0 59 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: "drop-shadow(0px 0px 24px #3b82f6)" }}
            >
              <path
                d="M11.7204 0.398132C17.2432 0.398132 21.7204 4.87529 21.7204 10.3981V27.8981C21.7204 28.3584 22.0935 28.7315 22.5537 28.7315C23.0139 28.7315 23.387 28.3584 23.387 27.8981V10.3981C23.387 4.87528 27.8642 0.398132 33.387 0.398132H46.7204C53.1637 0.398132 58.387 5.62148 58.387 12.0648V16.2445C58.387 19.0514 57.3754 21.7649 55.5371 23.8861L44.1146 37.0648H30.8822L47.9801 17.3366L48.0729 17.2194C48.2767 16.9367 48.387 16.5955 48.387 16.2445V12.0648C48.387 11.1443 47.6409 10.3981 46.7204 10.3981H35.0537V9.5648C35.0537 9.10456 34.6806 8.73147 34.2204 8.73147C33.7601 8.73147 33.387 9.10456 33.387 9.5648V27.0648C33.387 32.5876 28.9099 37.0648 23.387 37.0648H21.7204C16.1975 37.0648 11.7204 32.5876 11.7204 27.0648V9.5648C11.7204 9.10456 11.3473 8.73147 10.887 8.73147C10.4268 8.73147 10.0537 9.10456 10.0537 9.5648V37.0648H0.0537109V10.3981C0.0537109 4.87528 4.53086 0.398132 10.0537 0.398132H11.7204Z"
                fill="#3b82f6"
              ></path>
            </svg>
          </div>

          {/* Middle nav links */}
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <Link href={"/"}>
                <p className="rounded-md px-3 py-2 text-sm font-medium text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 transition-all duration-300 shadow-sm hover:shadow-blue-500/50">
                  Campaigns
                </p>
              </Link>
              {account && (
                <Link href={`/dashboard/${account?.address}`}>
                  <p className="rounded-md px-3 py-2 text-sm font-medium text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 transition-all duration-300 shadow-sm hover:shadow-blue-500/50">
                    Dashboard
                  </p>
                </Link>
              )}
            </div>
          </div>

          {/* Right side: ConnectButton + Hamburger */}
          <div className="flex items-center space-x-2">
            <ConnectButton
              client={client}
              theme={darkTheme({
                colors: {
                  modalBg: "hsl(0, 0%, 0%)",
                  primaryButtonBg: "hsl(240, 100%, 50%)",
                },
              })}
            />
            {/* Hamburger Menu - only visible on mobile */}
            <div className="sm:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
