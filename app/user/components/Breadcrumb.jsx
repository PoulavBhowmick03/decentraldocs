import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            {index === items.length - 1 ? (
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="ml-1 text-sm font-medium text-blue-500 hover:text-blue-600 md:ml-2">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
