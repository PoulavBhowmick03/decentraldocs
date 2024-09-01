import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CertificateGenerator() {
  const [certificateType, setCertificateType] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle certificate generation logic here
    console.log('Generate certificate:', { certificateType, recipientName, additionalInfo })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Certificate</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certificateType">Certificate Type</Label>
            <Select value={certificateType} onValueChange={setCertificateType}>
              <SelectTrigger>
                <SelectValue placeholder="Select certificate type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birth">Birth Certificate</SelectItem>
                <SelectItem value="academic">Academic Transcript</SelectItem>
                <SelectItem value="experience">Experience Certificate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipientName">Recipient Name</Label>
            <Input
              id="recipientName"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter recipient's name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Enter any additional information"
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full">Generate Certificate</Button>
        </form>
      </CardContent>
    </Card>
  )
}
