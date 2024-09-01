// components/GlobalSearch.jsx
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search logic here
    console.log('Searching for:', searchQuery)
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Search documents, certificates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}