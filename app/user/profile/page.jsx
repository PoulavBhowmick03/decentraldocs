"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'I am a user of BlockLocker.',
  })

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Updated profile:', profile)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={profile.name} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={profile.email} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                value={profile.bio} 
                onChange={handleChange} 
                rows={4} 
              />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
