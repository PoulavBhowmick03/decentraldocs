import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DocumentViewer({ document }) {
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{document.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Issue Date: {document.issueDate}</p>
          <p>Status: {document.status}</p>
          <div className="border p-4 rounded bg-gray-100">
            {/* This is where you'd render the actual document content */}
            <p>Document content placeholder</p>
          </div>
          <Button onClick={handleVerify} disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify Document'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
