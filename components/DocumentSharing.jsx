// components/DocumentSharing.jsx
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Share2 } from 'lucide-react'

export default function DocumentSharing({ documentId }) {
  const [email, setEmail] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleShare = () => {
    // Implement sharing logic here
    console.log('Sharing document', documentId, 'with', email)
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter recipient's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleShare}>Share Document</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}