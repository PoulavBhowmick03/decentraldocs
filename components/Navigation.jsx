"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname.startsWith(path) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
  }

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold">BlockLocker</Link>
          <div className="flex space-x-4">
            <Link href="/issuer">
              <Button variant="ghost" className={isActive('/issuer')}>Issuer</Button>
            </Link>
            <Link href="/verifier">
              <Button variant="ghost" className={isActive('/verifier')}>Verifier</Button>
            </Link>
            <Link href="/user">
              <Button variant="ghost" className={isActive('/user')}>User</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
