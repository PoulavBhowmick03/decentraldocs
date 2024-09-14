// import { AuthProvider } from '@/context/AuthContext'
import "../globals.css";

export default function UserLayout({ children }) {
  return (
    <div className="relative flex h-screen bg-gray-900 text-gray-100">
      {/* Dotted background SVG */}
      <div className="fixed inset-0 z-0">
        <svg
          className="w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="dotPattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#dotPattern)"
          />
        </svg>
      </div>

      {/* Main content */}
      <main className="flex-1 relative z-10 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
