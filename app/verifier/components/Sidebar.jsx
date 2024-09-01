"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiBell, FiFileText, FiCheckSquare, FiSettings } from 'react-icons/fi'

const navItems = [
  { icon: FiHome, label: 'Dashboard', href: '/verifier' },
  { icon: FiBell, label: 'Notifications', href: '/verifier/notifications' },
  { icon: FiFileText, label: 'Documents', href: '/verifier/documents' },
  { icon: FiCheckSquare, label: 'Verified', href: '/verifier/verified' },
  { icon: FiSettings, label: 'Settings', href: '/verifier/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <h2 className="text-2xl font-semibold text-center mb-6">BlockLocker</h2>
      <nav>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span className={`flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
              pathname === item.href ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </span>
          </Link>
        ))}
      </nav>
    </div>
  )
}